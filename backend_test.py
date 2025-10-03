import requests
import sys
import json
from datetime import datetime, timedelta

class AlumniNexusAPITester:
    def __init__(self, base_url="https://alumni-nexus-4.preview.emergentagent.com"):
        self.base_url = base_url
        self.alumni_token = None
        self.admin_token = None
        self.alumni_user = None
        self.admin_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.alumni_profile_id = None
        self.event_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) < 10:
                        print(f"   Response: {response_data}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}")

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_auth_register_alumni(self):
        """Test alumni registration"""
        test_data = {
            "email": "alumni@test.com",
            "password": "password123",
            "role": "alumni"
        }
        success, response = self.run_test(
            "Alumni Registration",
            "POST",
            "api/auth/register",
            200,
            data=test_data
        )
        if success and 'access_token' in response:
            self.alumni_token = response['access_token']
            self.alumni_user = response['user']
            print(f"   Alumni token obtained: {self.alumni_token[:20]}...")
            return True
        return False

    def test_auth_register_admin(self):
        """Test admin registration"""
        test_data = {
            "email": "admin@test.com",
            "password": "password123",
            "role": "admin"
        }
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "api/auth/register",
            200,
            data=test_data
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            self.admin_user = response['user']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_auth_login_alumni(self):
        """Test alumni login"""
        test_data = {
            "email": "alumni@test.com",
            "password": "password123"
        }
        success, response = self.run_test(
            "Alumni Login",
            "POST",
            "api/auth/login",
            200,
            data=test_data
        )
        if success and 'access_token' in response:
            self.alumni_token = response['access_token']
            return True
        return False

    def test_auth_login_admin(self):
        """Test admin login"""
        test_data = {
            "email": "admin@test.com",
            "password": "password123"
        }
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data=test_data
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            return True
        return False

    def test_auth_me_alumni(self):
        """Test protected route with alumni token"""
        success, response = self.run_test(
            "Get Alumni User Info",
            "GET",
            "api/auth/me",
            200,
            token=self.alumni_token
        )
        return success

    def test_auth_me_admin(self):
        """Test protected route with admin token"""
        success, response = self.run_test(
            "Get Admin User Info",
            "GET",
            "api/auth/me",
            200,
            token=self.admin_token
        )
        return success

    def test_create_alumni_profile(self):
        """Test creating alumni profile"""
        profile_data = {
            "full_name": "John Doe",
            "phone": "+1234567890",
            "graduation_year": 2020,
            "degree": "Bachelor of Computer Science",
            "department": "Computer Science",
            "current_position": "Software Engineer",
            "current_company": "Tech Corp",
            "linkedin_url": "https://linkedin.com/in/johndoe",
            "bio": "Passionate software engineer with 3 years of experience."
        }
        success, response = self.run_test(
            "Create Alumni Profile",
            "POST",
            "api/alumni/profile",
            200,
            data=profile_data,
            token=self.alumni_token
        )
        if success and 'id' in response:
            self.alumni_profile_id = response['id']
            print(f"   Profile ID: {self.alumni_profile_id}")
        return success

    def test_get_alumni_profile(self):
        """Test getting alumni profile"""
        success, response = self.run_test(
            "Get Alumni Profile",
            "GET",
            "api/alumni/profile",
            200,
            token=self.alumni_token
        )
        return success

    def test_update_alumni_profile(self):
        """Test updating alumni profile"""
        update_data = {
            "current_position": "Senior Software Engineer",
            "current_company": "Better Tech Corp",
            "bio": "Senior software engineer with 4 years of experience in full-stack development."
        }
        success, response = self.run_test(
            "Update Alumni Profile",
            "PUT",
            "api/alumni/profile",
            200,
            data=update_data,
            token=self.alumni_token
        )
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        success, response = self.run_test(
            "Get Admin Stats",
            "GET",
            "api/admin/stats",
            200,
            token=self.admin_token
        )
        return success

    def test_admin_get_all_alumni(self):
        """Test admin get all alumni"""
        success, response = self.run_test(
            "Get All Alumni (Admin)",
            "GET",
            "api/admin/alumni",
            200,
            token=self.admin_token
        )
        return success

    def test_create_event_admin(self):
        """Test creating event as admin"""
        future_date = (datetime.now() + timedelta(days=30)).isoformat()
        event_data = {
            "title": "Alumni Networking Event",
            "description": "Join us for an evening of networking and reconnecting with fellow alumni.",
            "date": future_date,
            "location": "University Campus, Main Hall"
        }
        success, response = self.run_test(
            "Create Event (Admin)",
            "POST",
            "api/events",
            200,
            data=event_data,
            token=self.admin_token
        )
        if success and 'id' in response:
            self.event_id = response['id']
            print(f"   Event ID: {self.event_id}")
        return success

    def test_get_events_alumni(self):
        """Test getting events as alumni"""
        success, response = self.run_test(
            "Get Events (Alumni)",
            "GET",
            "api/events",
            200,
            token=self.alumni_token
        )
        return success

    def test_get_events_admin(self):
        """Test getting events as admin"""
        success, response = self.run_test(
            "Get Events (Admin)",
            "GET",
            "api/events",
            200,
            token=self.admin_token
        )
        return success

    def test_delete_alumni_admin(self):
        """Test deleting alumni as admin"""
        if not self.alumni_profile_id:
            print("⚠️  Skipping delete test - no alumni profile ID available")
            return True
            
        success, response = self.run_test(
            "Delete Alumni (Admin)",
            "DELETE",
            f"api/admin/alumni/{self.alumni_profile_id}",
            200,
            token=self.admin_token
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access scenarios"""
        print("\n🔒 Testing Unauthorized Access Scenarios...")
        
        # Test admin endpoint with alumni token
        success, _ = self.run_test(
            "Admin Stats with Alumni Token (Should Fail)",
            "GET",
            "api/admin/stats",
            403,
            token=self.alumni_token
        )
        
        # Test protected endpoint without token
        success2, _ = self.run_test(
            "Protected Endpoint without Token (Should Fail)",
            "GET",
            "api/auth/me",
            401
        )
        
        return success and success2

def main():
    print("🚀 Starting Alumni Nexus API Testing...")
    print("=" * 60)
    
    tester = AlumniNexusAPITester()
    
    # Test sequence
    test_sequence = [
        # Authentication Tests
        ("Alumni Registration", tester.test_auth_register_alumni),
        ("Admin Registration", tester.test_auth_register_admin),
        ("Alumni Login", tester.test_auth_login_alumni),
        ("Admin Login", tester.test_auth_login_admin),
        ("Alumni Auth Me", tester.test_auth_me_alumni),
        ("Admin Auth Me", tester.test_auth_me_admin),
        
        # Alumni Profile Tests
        ("Create Alumni Profile", tester.test_create_alumni_profile),
        ("Get Alumni Profile", tester.test_get_alumni_profile),
        ("Update Alumni Profile", tester.test_update_alumni_profile),
        
        # Admin Tests
        ("Admin Stats", tester.test_admin_stats),
        ("Admin Get All Alumni", tester.test_admin_get_all_alumni),
        
        # Event Tests
        ("Create Event (Admin)", tester.test_create_event_admin),
        ("Get Events (Alumni)", tester.test_get_events_alumni),
        ("Get Events (Admin)", tester.test_get_events_admin),
        
        # Security Tests
        ("Unauthorized Access", tester.test_unauthorized_access),
        
        # Cleanup Tests
        ("Delete Alumni (Admin)", tester.test_delete_alumni_admin),
    ]
    
    failed_tests = []
    
    for test_name, test_func in test_sequence:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ All tests passed!")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())