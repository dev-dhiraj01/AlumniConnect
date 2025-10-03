import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  User,
  Calendar,
  Users,
  LogOut,
  Edit3,
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin,
  Save,
  X,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const AlumniDashboard = ({ user, onLogout }) => {
  const location = useLocation();

  const ProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
      full_name: "",
      phone: "",
      graduation_year: "",
      degree: "",
      department: "",
      current_position: "",
      current_company: "",
      linkedin_url: "",
      bio: "",
    });

    useEffect(() => {
      fetchProfile();
    }, []);

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/alumni/profile`);
        setProfile(response.data);
        setFormData({
          full_name: response.data.full_name,
          phone: response.data.phone,
          graduation_year: response.data.graduation_year,
          degree: response.data.degree,
          department: response.data.department,
          current_position: response.data.current_position || "",
          current_company: response.data.current_company || "",
          linkedin_url: response.data.linkedin_url || "",
          bio: response.data.bio || "",
        });
      } catch (error) {
        if (error.response?.status === 404) {
          setEditing(true);
        } else {
          setError("Error fetching profile");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      try {
        let response;
        if (profile) {
          response = await axios.put(
            `${API_BASE}/api/alumni/profile`,
            formData
          );
        } else {
          response = await axios.post(
            `${API_BASE}/api/alumni/profile`,
            formData
          );
        }

        setProfile(response.data);
        setEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.detail || "Error updating profile");
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (editing || !profile) {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile ? "Edit Profile" : "Create Your Profile"}
            </h1>
            {profile && (
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>

          {error && <div className="alert-error fade-in">{error}</div>}
          {success && <div className="alert-success fade-in">{success}</div>}

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="form-input"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Bachelor of Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Current Position</label>
                  <input
                    type="text"
                    name="current_position"
                    value={formData.current_position}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="form-label">Current Company</label>
                  <input
                    type="text"
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Tech Corp"
                  />
                </div>
                <div>
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {success && <div className="alert-success fade-in">{success}</div>}

        <div className="card">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile.full_name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.phone}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {profile.degree} ({profile.graduation_year})
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {profile.department}
                </div>
                {profile.current_position && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    {profile.current_position} at {profile.current_company}
                  </div>
                )}
              </div>
              {profile.bio && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}
              {profile.linkedin_url && (
                <div className="mt-4">
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View LinkedIn Profile →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EventsView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchEvents();
    }, []);

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const isUpcoming = (dateString) => {
      return new Date(dateString) > new Date();
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    const upcomingEvents = events.filter((event) => isUpcoming(event.date));
    const pastEvents = events.filter((event) => !isUpcoming(event.date));

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>

        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="card border-l-4 border-green-500"
                >
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-600">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="card opacity-75">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events available at the moment.
          </div>
        )}
      </div>
    );
  };

  const NetworkView = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // For now, we'll use a placeholder since alumni network endpoint needs to be public
      // In a real implementation, you'd create a separate endpoint for alumni networking
      setLoading(false);
    }, []);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>

        <div className="card">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              The alumni networking feature is being developed. You'll soon be
              able to connect with fellow alumni, find mentors, and expand your
              professional network.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const navItems = [
    { path: "/alumni", icon: User, label: "My Profile", exact: true },
    { path: "/alumni/events", icon: Calendar, label: "Events" },
    { path: "/alumni/network", icon: Users, label: "Network" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold">AlumniSphere</h2>
                <p className="text-sm text-gray-500">Alumni panel</p>
              </div>
            </div>
          </div>

          <nav className="px-4 pb-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item flex items-center ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="nav-item flex items-center text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<ProfileView />} />
            <Route path="/events" element={<EventsView />} />
            <Route path="/network" element={<NetworkView />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
