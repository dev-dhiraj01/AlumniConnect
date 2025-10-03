import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import GirlImg from "./girlimg.png";
import celebrateImg from "./celebrat.png";
import careerImg from "./career.png";
import networkImg from "./network.png";
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import {
  FaBriefcase,
  FaBook,
  FaUsers,
  FaDollarSign,
  FaHeart,
} from "react-icons/fa";
import feather from "feather-icons";
import { Facebook, Instagram, Linkedin, Youtube } from "react-feather";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    AOS.init({ duration: 1000 });
    feather.replace();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header
        className={`fixed w-full z-10 shadow-md transition-all duration-300 ${
          scrolled ? "bg-white py-0" : "bg-[#fcf6f6] py-1"
        }`}
        // style={{ backgroundColor: "#fcf6f6" }}
      >
        <nav className="container mx-auto flex justify-between items-center p-4">
          <h1
            className={`font-bold transition-all duration-300 ${
              scrolled ? "text-2xl text-red" : "text-3xl text-red-700"
            } flex items-center`} // <-- flex for side-by-side
          >
            <i
              data-feather="award"
              className="mr-2 font-bold"
              style={{ width: "28px", height: "28px", strokeWidth: 2.5 }}
            ></i>
            AlumniSphere
          </h1>
          <ul
            className={`flex space-x-6 font-bold font-sans transition-all duration-300 ${
              scrolled ? "text-black" : "text-xl text-black-700"
            }`}
          >
            <li>
              <a href="#home" className="hover:text-red-600">
                Home
              </a>
            </li>
            <li>
              <a href="#events" className="hover:text-red-600">
                Events
              </a>
            </li>
            <li>
              <a href="#benefits" className="hover:text-red-600">
                Benefits
              </a>
            </li>
            <li>
              <a href="#connect" className="hover:text-red-600">
                Connect
              </a>
            </li>
            <li>
              <a href="#give" className="hover:text-red-600">
                Give
              </a>
            </li>
          </ul>
        </nav>
        {/* Features of the website */}
        <div
          className={`flex space-x-6 font-bold justify-center font-sans transition-all duration-300 ${
            scrolled ? "text-black" : "text-xl text-black-700"
          }`}
        >
          {[
            "Reliable System",
            "Alumni Communication",
            "Mentoring",
            "Internships",
            "Fundraising",
          ].map((feature, index, array) => (
            <React.Fragment key={index}>
              <span className="text-gray-700 hover:text-red-600 cursor-pointer whitespace-nowrap">
                {feature}
              </span>
              {index < array.length - 1 && (
                <span className="text-gray-400">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen flex flex-col md:flex-row justify-center items-center text-left md:text-left px-6 md:px-20"
        style={{ backgroundColor: "#fcf6f6" }}
      >
        {/* Left Content */}
        <div className="md:w-1/2 flex flex-col justify-center items-start">
          <h2 data-aos="fade-up" className="text-6xl font-bold mb-4 text-black">
            Welcome to Our <div className="text-red-700">Alumni Network</div>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mb-6 max-w-lg text-gray-700 text-2xl"
          >
            Join a global community of alumni who are making an impact. Connect,
            grow, and give back through our network.
          </p>
          <div
            data-aos="zoom-in"
            data-aos-delay="400"
            className="flex space-x-4"
          >
            {/* <a
              href="#connect"
              className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
            >
              Join Now
            </a> */}

            <button
              onClick={() => navigate("/auth")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Join Now
            </button>
            <a
              href="#learn"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <img
            src={GirlImg} // Replace with your uploaded image path
            alt="Alumni Network"
            className="rounded-xl shadow-lg max-w-full h-auto mt-10"
          />
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "250K+", label: "Alumni Worldwide" },
            { number: "180+", label: "Countries" },
            { number: "50+", label: "Regional Clubs" },
            { number: "1M+", label: "Connections Made" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg p-6 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={i * 200}
            >
              <h3 className="text-4xl font-bold text-red-700">{stat.number}</h3>
              <p className="mt-2 text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Events Section */}
      <section id="events" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover opportunities to connect, learn, and grow with fellow
            alumni around the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Annual Alumni Reunion",
                date: "June 15, 2023",
                location: "San Francisco, CA",
                desc: "Join us for our biggest event of the year with keynote speakers and networking opportunities.",
                image: celebrateImg,
              },
              {
                title: "Career Development Workshop",
                date: "July 22, 2023",
                location: "Online",
                desc: "Learn from industry leaders about career advancement strategies in the digital age.",
                image: careerImg,
              },
              {
                title: "Regional Networking Mixer",
                date: "August 5, 2023",
                location: "New York, NY",
                desc: "Connect with local alumni in your area for professional and social networking.",
                image: networkImg,
              },
            ].map((event, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 200}
                className="bg-white rounded-lg shadow overflow-hidden text-left"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{event.title}</h3>

                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    {event.date}
                  </p>

                  <p className="text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {event.location}
                  </p>

                  <p className="mt-3 text-gray-700">{event.desc}</p>

                  {/* Learn More Button */}
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center text-red-600 font-medium hover:text-red-700 transition"
                  >
                    Learn More
                    <FaArrowRight className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold mb-4">
            Alumni Benefits
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Exclusive advantages and resources available to our alumni
            community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBriefcase />,
                title: "Career Services",
                desc: "Access to job boards, career counseling, and exclusive recruitment events.",
              },
              {
                icon: <FaBook />,
                title: "Lifelong Learning",
                desc: "Audit courses, access online resources, and attend exclusive lectures.",
              },
              {
                icon: <FaUsers />,
                title: "Networking",
                desc: "Connect with alumni across industries through our global directory.",
              },
              {
                icon: <FaDollarSign />,
                title: "Financial Benefits",
                desc: "Discounts on insurance, financial services, and continuing education.",
              },
              {
                icon: <FaMapMarkerAlt />,
                title: "Travel Perks",
                desc: "Access to alumni clubs worldwide and travel programs.",
              },
              {
                icon: <FaHeart />,
                title: "Give Back",
                desc: "Opportunities to mentor students and support your alma mater.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-2 bg-gray-100 rounded-lg shadow h-64 w-full "
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-4 text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold mb-3">
            Alumni Stories
          </h2>
          <p className="text-gray-600 mb-12">
            Hear from members of our global alumni community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Class of 2015, Product Manager",
                text: "The alumni network helped me find my dream job through connections I made at an event.",
                image: i1,
              },
              {
                name: "Michael Chen",
                role: "Class of 2010, Consultant",
                text: "I've attended alumni events in three different countries - the community is truly global.",
                image: i2,
              },
              {
                name: "Jessica Williams",
                role: "Class of 2018, Entrepreneur",
                text: "The career resources available to alumni have been invaluable throughout my professional journey.",
                image: i3,
              },
            ].map((t, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 200}
                className="bg-white p-6 rounded-lg shadow flex flex-col text-left"
              >
                {/* Profile Section */}
                <div className="flex items-center mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>

                {/* Testimonial */}
                <p className="text-gray-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold mb-8">
            Stay Connected
          </h2>
          <form
            data-aos="fade-up"
            data-aos-delay="200"
            className="max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded mb-4"
            />
            <button className="w-full p-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      {/* Give Section */}
      <section id="give" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold mb-6">
            Give Back
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" className="mb-6">
            Support scholarships and community initiatives.
          </p>
          <a
            href="#"
            data-aos="zoom-in"
            data-aos-delay="400"
            className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow hover:bg-red-700"
          >
            Donate Now
          </a>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-black text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Left Column - Address and Social Media */}
          <div>
            <h2 className="font-bold text-lg mb-2">AlumniSphere</h2>
            <p>Mumbai w. Andheri Alumni Center</p>
            <p>46 maval Street</p>
            {/* <a
              href="#"
              className="text-red-500 font-semibold mt-2 inline-block"
            >
              Map <span aria-hidden="true">↗</span>
            </a> */}

            {/* Social Icons */}
            <div className="flex space-x-4 text-gray-700">
              <a href="#" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Get to Know SAA
            </a>
            <a href="#" className="block hover:underline">
              STANFORD Magazine
            </a>
            <a href="#" className="block hover:underline">
              Contact Us
            </a>
            <a href="#" className="block hover:underline">
              Help
            </a>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Access SAA Member Card
            </a>
            <a href="#" className="block hover:underline">
              Check your alumni email
            </a>
            <a href="#" className="block hover:underline">
              My Alumni Account
            </a>
            <a href="#" className="block hover:underline">
              Give to Stanford
            </a>
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Accessibility
            </a>
            <a href="#" className="block hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="block hover:underline">
              Terms of Use
            </a>
            <a href="#" className="block hover:underline">
              Code of Conduct
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
