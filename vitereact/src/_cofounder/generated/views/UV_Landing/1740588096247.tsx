import React from "react";
import { Link } from "react-router-dom";

const UV_Landing: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-24">
        <h1 className="text-5xl font-extrabold mb-4">
          AI-Powered UI Design Platform
        </h1>
        <p className="text-lg max-w-3xl mx-auto opacity-90">
          Create, manage, and collaborate on UI/UX designs with our intelligent,
          AI-driven editor. Bring your ideas to life effortlessly!
        </p>
        <div className="mt-8">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold mr-4 hover:bg-gray-100"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-gray-100 text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 text-center shadow-lg rounded-lg">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">AI-Driven Design</h3>
            <p>Let AI assist in generating beautiful, responsive UI layouts.</p>
          </div>
          <div className="bg-white p-6 text-center shadow-lg rounded-lg">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Collaboration</h3>
            <p>Work with your team in a live, synchronous workspace.</p>
          </div>
          <div className="bg-white p-6 text-center shadow-lg rounded-lg">
            <div className="text-5xl mb-4">📤</div>
            <h3 className="text-xl font-semibold mb-2">One-Click Exports</h3>
            <p>Generate Tailwind, HTML/CSS, or image assets instantly.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-10">Flexible Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-8">
          {/* Free Plan */}
          <div className="border p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
            <p className="mb-4 text-gray-600">For hobbyists and small teams.</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✅ AI-assisted components</li>
              <li>✅ 5 Projects</li>
              <li>✅ Basic export options</li>
            </ul>
            <Link
              to="/signup"
              className="block bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="border p-6 rounded-lg shadow-md bg-blue-600 text-white">
            <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
            <p className="mb-4">For professionals and businesses.</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✅ Unlimited Projects</li>
              <li>✅ Advanced AI features</li>
              <li>✅ Full code generation</li>
              <li>✅ Priority support</li>
            </ul>
            <Link
              to="/signup"
              className="block bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic text-lg">
              "This platform completely changed the way we design UI! The AI
              recommendations are game-changing."
            </p>
            <p className="mt-4 text-gray-600">- Alex Johnson, Product Manager</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold">Start Building Smarter</h2>
        <p className="mt-2 mb-6 opacity-90">
          Join thousands of designers streamlining their workflow with AI.
        </p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100"
        >
          Sign Up Free
        </Link>
      </section>
    </>
  );
};

export default UV_Landing;