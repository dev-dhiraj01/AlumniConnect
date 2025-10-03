// src/Homepage.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const Homepage = () => {
  const navigate = useNavigate();

  // Example data for charts
  const alumniData = [
    { year: "2015", count: 40 },
    { year: "2016", count: 55 },
    { year: "2017", count: 60 },
    { year: "2018", count: 70 },
    { year: "2019", count: 80 },
    { year: "2020", count: 65 },
    { year: "2021", count: 75 },
    { year: "2022", count: 90 },
  ];

  const eventData = [
    { name: "Webinar", value: 400 },
    { name: "Meetup", value: 300 },
    { name: "Networking", value: 300 },
    { name: "Workshop", value: 200 },
  ];

  const industryData = [
    { name: "Tech", value: 500 },
    { name: "Finance", value: 300 },
    { name: "Healthcare", value: 200 },
    { name: "Education", value: 150 },
    { name: "Others", value: 100 },
  ];

  const experienceData = [
    { year: "2018", experience: 2 },
    { year: "2019", experience: 2.7 },
    { year: "2020", experience: 4.5 },
    { year: "2021", experience: 5.7 },
    { year: "2022", experience: 6 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">Alumni Connect</h1>
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/events" className="text-gray-700 hover:text-blue-600">
            Events
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          {/* <button
            onClick={() => navigate("/register")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Register
          </button> */}
        </div>
      </nav>

      {/* Features of the website */}
      <div className="bg-white shadow-md p-4 flex flex-wrap justify-center items-center gap-4">
        {[
          "Reliable System",
          "Alumni Communication",
          "Mentoring",
          "Internships",
          "Fundraising",
        ].map((feature, index, array) => (
          <React.Fragment key={index}>
            <span className="text-gray-700 hover:text-blue-600 cursor-pointer whitespace-nowrap">
              {feature}
            </span>
            {index < array.length - 1 && (
              <span className="text-gray-400">|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Features of the website */}
      {/* <section className="bg-white shadow-md p-6 my-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Features of Alumni Connect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Reliable System</h3>
            <p>
              Centralized data for all alumni communications and networking.
            </p>
          </div>
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Alumni Relationships</h3>
            <p>Build long-lasting connections and mentorship opportunities.</p>
          </div>
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Mentoring</h3>
            <p>Find and offer guidance to fellow alumni and students.</p>
          </div>
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Internships</h3>
            <p>
              Access career opportunities and internship programs worldwide.
            </p>
          </div>
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Fundraising</h3>
            <p>
              Support alumni initiatives and university projects through
              donations.
            </p>
          </div>
          <div className="p-4 border rounded hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Communication Tools</h3>
            <p>Stay connected through chats, webinars, and community events.</p>
          </div>
        </div>
      </section> */}

      {/* Welcome Section */}
      <div className="p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Alumni Connect
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with fellow alumni, explore events, and stay updated with
          professional growth opportunities.
        </p>
      </div>

      {/* Info Sections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mb-10">
        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Explore Alumni</h3>
          <p>Search for alumni across industries and batches.</p>
          <button
            onClick={() => navigate("/alumni-directory")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Directory
          </button>
        </div>

        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Join Events</h3>
          <p>Participate in webinars, meetups, and workshops.</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            View Events
          </button>
        </div>

        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Get Support</h3>
          <p>Find resources and connect for mentorship and career guidance.</p>
          <button
            onClick={() => navigate("/about")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">
            Alumni by Graduation Year
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={alumniData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Event Participation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={eventData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
              >
                {eventData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Top Industries</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={industryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {industryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Experience Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={experienceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="experience" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <footer className="mt-10 text-center text-gray-500 p-4">
        © 2025 Alumni Connect. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
