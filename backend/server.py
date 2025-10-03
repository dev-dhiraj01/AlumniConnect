from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Models
class UserRole(str):
    ADMIN = "admin"
    ALUMNI = "alumni"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = UserRole.ALUMNI

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AlumniProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    full_name: str
    phone: str
    graduation_year: int
    degree: str
    department: str
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AlumniProfileCreate(BaseModel):
    full_name: str
    phone: str
    graduation_year: int
    degree: str
    department: str
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None

class AlumniProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: datetime
    location: str
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return User(**user)

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_obj = User(**{k: v for k, v in user_dict.items() if k != "password"})
    
    await db.users.insert_one({**user_obj.dict(), "password": hashed_password})
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_obj}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_obj = User(**{k: v for k, v in db_user.items() if k != "password"})
    return {"access_token": access_token, "token_type": "bearer", "user": user_obj}

@api_router.get("/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Alumni Profile Routes
@api_router.post("/alumni/profile", response_model=AlumniProfile)
async def create_alumni_profile(profile: AlumniProfileCreate, current_user: User = Depends(get_current_user)):
    # Check if profile already exists
    existing_profile = await db.alumni_profiles.find_one({"user_id": current_user.id})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    profile_dict = profile.dict()
    profile_dict["user_id"] = current_user.id
    profile_obj = AlumniProfile(**profile_dict)
    
    await db.alumni_profiles.insert_one(profile_obj.dict())
    return profile_obj

@api_router.get("/alumni/profile", response_model=AlumniProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    profile = await db.alumni_profiles.find_one({"user_id": current_user.id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return AlumniProfile(**profile)

@api_router.put("/alumni/profile", response_model=AlumniProfile)
async def update_my_profile(profile_update: AlumniProfileUpdate, current_user: User = Depends(get_current_user)):
    existing_profile = await db.alumni_profiles.find_one({"user_id": current_user.id})
    if not existing_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    update_data = {k: v for k, v in profile_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.alumni_profiles.update_one(
        {"user_id": current_user.id},
        {"$set": update_data}
    )
    
    updated_profile = await db.alumni_profiles.find_one({"user_id": current_user.id})
    return AlumniProfile(**updated_profile)

# Admin Routes
@api_router.get("/admin/alumni", response_model=List[AlumniProfile])
async def get_all_alumni(current_admin: User = Depends(get_current_admin)):
    alumni = await db.alumni_profiles.find().to_list(1000)
    return [AlumniProfile(**alumni_profile) for alumni_profile in alumni]

@api_router.get("/admin/alumni/{alumni_id}", response_model=AlumniProfile)
async def get_alumni_by_id(alumni_id: str, current_admin: User = Depends(get_current_admin)):
    profile = await db.alumni_profiles.find_one({"id": alumni_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumni not found"
        )
    return AlumniProfile(**profile)

@api_router.delete("/admin/alumni/{alumni_id}")
async def delete_alumni(alumni_id: str, current_admin: User = Depends(get_current_admin)):
    result = await db.alumni_profiles.delete_one({"id": alumni_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumni not found"
        )
    return {"message": "Alumni deleted successfully"}

# Event Routes
@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate, current_admin: User = Depends(get_current_admin)):
    event_dict = event.dict()
    event_dict["created_by"] = current_admin.id
    event_obj = Event(**event_dict)
    
    await db.events.insert_one(event_obj.dict())
    return event_obj

@api_router.get("/events", response_model=List[Event])
async def get_events(current_user: User = Depends(get_current_user)):
    events = await db.events.find().to_list(1000)
    return [Event(**event) for event in events]

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str, current_user: User = Depends(get_current_user)):
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return Event(**event)

# Dashboard Stats
@api_router.get("/admin/stats")
async def get_admin_stats(current_admin: User = Depends(get_current_admin)):
    total_alumni = await db.alumni_profiles.count_documents({})
    total_events = await db.events.count_documents({})
    total_users = await db.users.count_documents({})
    
    return {
        "total_alumni": total_alumni,
        "total_events": total_events,
        "total_users": total_users
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()