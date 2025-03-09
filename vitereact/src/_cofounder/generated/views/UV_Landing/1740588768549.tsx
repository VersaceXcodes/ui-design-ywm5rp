import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUsers, FaStar, FaSmile } from "react-icons/fa";

const UV_Landing: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold">AI-Powered UI Design Platform</h1>
          <p className="text-lg mt-4">
            Effortlessly create, collaborate, and export stunning UI designs powered by AI.
          </p>
          <div className="mt-6 space-x-4">
            <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-md text-lg font-semibold inline-block">
              Sign Up for Free
            </Link>
            <Link to="/login" className="bg-gray-200 text-blue-800 px-6 py-3 rounded-md text-lg font-semibold inline-block">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold">Why Choose Our Platform?</h2>
          <p className="text-lg text-gray-700 mt-2">
            Explore our powerful features crafted for designers, developers, and product teams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <FaCheckCircle className="text-blue-500 text-4xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">AI-Driven Design</h3>
              <p className="text-gray-600 mt-2">Smart AI suggestions for efficient UI design.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <FaUsers className="text-blue-500 text-4xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Team Collaboration</h3>
              <p className="text-gray-600 mt-2">Work together in real-time with seamless collaboration.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <FaStar className="text-blue-500 text-4xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Export with Ease</h3>
              <p className="text-gray-600 mt-2">Download assets in multiple formats instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-semibold">Flexible Pricing Plans</h2>
          <p className="text-lg text-gray-700 mt-2">Choose the plan that fits your needs.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="border p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Free Plan</h3>
              <p className="text-2xl font-semibold mt-2">$0/month</p>
              <ul className="mt-4 text-gray-600 space-y-2">
                <li>✔ Basic Features</li>
                <li>✔ Single Project</li>
                <li>✔ Community Support</li>
              </ul>
              <Link to="/signup" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
                Get Started
              </Link>
            </div>
            <div className="border p-6 rounded-lg shadow-md bg-blue-500 text-white">
              <h3 className="text-xl font-bold">Pro Plan</h3>
              <p className="text-2xl font-semibold mt-2">$15/month</p>
              <ul className="mt-4 space-y-2">
                <li>✔ Unlimited Projects</li>
                <li>✔ AI Powered Assistance</li>
                <li>✔ Real-time Collaboration</li>
              </ul>
              <Link to="/signup" className="mt-6 inline-block bg-white text-blue-600 px-4 py-2 rounded-md">
                Upgrade Now
              </Link>
            </div>
            <div className="border p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <p className="text-2xl font-semibold mt-2">Custom Pricing</p>
              <ul className="mt-4 text-gray-600 space-y-2">
                <li>✔ Tailored Solutions</li>
                <li>✔ Priority Support</li>
                <li>✔ Dedicated Account Manager</li>
              </ul>
              <Link to="/signup" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-semibold">Trusted by Designers & Teams</h2>
          <div className="mt-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaSmile className="text-blue-500 text-4xl mx-auto" />
              <p className="text-gray-700 mt-4 italic">
                "This platform revolutionized our UI workflow. The AI-powered suggestions saved us hours!"
              </p>
              <p className="mt-4 font-semibold">— Alex Johnson, Product Designer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-10 bg-blue-600 text-white text-center">
        <h2 className="text-2xl font-semibold">Ready to Design Smarter?</h2>
        <p className="text-lg mt-2">Join now and transform your UI design process with AI.</p>
        <Link to="/signup" className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold">
          Get Started for Free
        </Link>
      </footer>
    </>
  );
};

export default UV_Landing;