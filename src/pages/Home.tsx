import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover Tech Events Near You
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Connect with the tech community, find hackathons, workshops, and meetups
          that match your skills and interests.
        </p>
        <div className="space-x-4">
          <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Browse Events
          </Link>
          <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
            Join Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
          <p className="text-gray-600">
            Get personalized event recommendations based on your skills and location.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Networking</h3>
          <p className="text-gray-600">
            Connect with fellow tech enthusiasts and industry professionals.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Growth</h3>
          <p className="text-gray-600">
            Learn new skills, build projects, and advance your tech career.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of tech enthusiasts who are already discovering and participating
          in amazing tech events.
        </p>
        <Link to="/register" className="btn btn-primary">
          Create Your Account
        </Link>
      </section>
    </div>
  );
};

export default Home; 