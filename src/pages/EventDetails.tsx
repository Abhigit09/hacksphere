import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { eventsAPI } from '../services/api';
import { RootState } from '../store';

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: 'hackathon' | 'workshop' | 'meetup' | 'competition';
  start_date: string;
  end_date: string;
  location: string;
  skills_required: string[];
  max_participants: number;
  registration_deadline: string;
  prize_pool: number;
  created_by: number;
  participants: number[];
  created_at: string;
  updated_at: string;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventsAPI.getEvent(Number(id));
      setEvent(response);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch event details');
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setRegistering(true);
    try {
      await eventsAPI.registerForEvent(Number(id));
      await fetchEventDetails(); // Refresh event details to update participants
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = event?.participants.includes(user?.id || 0);
  const isFull = event?.participants.length === event?.max_participants;
  const isPastDeadline = new Date(event?.registration_deadline || '') < new Date();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-red-600">
        <p>{error || 'Event not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-800">
              {event.event_type}
            </span>
          </div>
          {user?.id === event.created_by && (
            <button
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="btn btn-secondary"
            >
              Edit Event
            </button>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(event.start_date).toLocaleString()} -{' '}
                  {new Date(event.end_date).toLocaleString()}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Registration closes: {new Date(event.registration_deadline).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.location}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {event.skills_required.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {event.participants.length} / {event.max_participants} participants
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Prize Pool: ${event.prize_pool}
                </p>
              </div>
            </div>

            {/* Registration Button */}
            <div className="pt-4">
              {isRegistered ? (
                <button
                  disabled
                  className="btn btn-secondary w-full"
                >
                  Already Registered
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="btn btn-secondary w-full"
                >
                  Event Full
                </button>
              ) : isPastDeadline ? (
                <button
                  disabled
                  className="btn btn-secondary w-full"
                >
                  Registration Closed
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn btn-primary w-full"
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 