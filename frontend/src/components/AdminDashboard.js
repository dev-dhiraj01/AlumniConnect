import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Calendar,
  BarChart3,
  LogOut,
  UserPlus,
  Trash2,
  GraduationCap,
  Building,
  MapPin,
  Plus,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = ({ user, onLogout }) => {
  const location = useLocation();

  const DashboardOverview = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/admin/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <div className="text-sm text-gray-500">
            Welcome back, {user.email}
           
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Alumni
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total_alumni || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.total_events || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.total_users || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/alumni"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Manage Alumni</h3>
              <p className="text-sm text-gray-600">
                View and manage alumni profiles
              </p>
            </Link>
            <Link
              to="/admin/events"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium">Manage Events</h3>
              <p className="text-sm text-gray-600">
                Create and organize events
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const AlumniManagement = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/admin/alumni`);
        setAlumni(response.data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    const deleteAlumni = async (alumniId) => {
      if (
        window.confirm("Are you sure you want to delete this alumni profile?")
      ) {
        try {
          await axios.delete(`${API_BASE}/api/admin/alumni/${alumniId}`);
          setAlumni(alumni.filter((a) => a.id !== alumniId));
        } catch (error) {
          console.error("Error deleting alumni:", error);
        }
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Alumni Management
          </h1>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Graduation Year</th>
                  <th>Degree</th>
                  <th>Current Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alumni.map((alumnus) => (
                  <tr key={alumnus.id}>
                    <td className="font-medium">{alumnus.full_name}</td>
                    <td>{alumnus.user_id}</td>
                    <td>{alumnus.graduation_year}</td>
                    <td>{alumnus.degree}</td>
                    <td>{alumnus.current_position || "Not specified"}</td>
                    <td>
                      <button
                        onClick={() => deleteAlumni(alumnus.id)}
                        className="btn-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {alumni.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No alumni profiles found.
            </div>
          )}
        </div>
      </div>
    );
  };

  const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      date: "",
      location: "",
    });

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

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const eventData = {
          ...formData,
          date: new Date(formData.date).toISOString(),
        };
        const response = await axios.post(`${API_BASE}/api/events`, eventData);
        setEvents([...events, response.data]);
        setFormData({ title: "", description: "", date: "", location: "" });
        setShowCreateForm(false);
      } catch (error) {
        console.error("Error creating event:", error);
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

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>

        {showCreateForm && (
          <div className="card fade-in">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="form-textarea"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card">
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

        {events.length === 0 && !showCreateForm && (
          <div className="text-center py-8 text-gray-500">
            No events found. Create your first event!
          </div>
        )}
      </div>
    );
  };

  const navItems = [
    { path: "/admin", icon: BarChart3, label: "Dashboard", exact: true },
    { path: "/admin/alumni", icon: Users, label: "Alumni Management" },
    { path: "/admin/events", icon: Calendar, label: "Event Management" },
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
                <p className="text-sm text-gray-500">Admin Panel</p>
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
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/alumni" element={<AlumniManagement />} />
            <Route path="/events" element={<EventManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
