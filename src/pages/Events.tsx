import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

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
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    location: '',
    skills: [] as string[],
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getEvents();
      setEvents(response);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch events');
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filters.eventType && event.event_type !== filters.eventType) {
      return false;
    }
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.skills.length > 0) {
      return filters.skills.some((skill) =>
        event.skills_required.some((requiredSkill) =>
          requiredSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }
    return true;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tech Events</h1>
        <Link to="/create-event" className="btn btn-primary">
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            id="eventType"
            name="eventType"
            value={filters.eventType}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Types</option>
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="competition">Competition</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="input"
            placeholder="Filter by location"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={filters.skills.join(', ')}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                skills: e.target.value.split(',').map((s) => s.trim()),
              }))
            }
            className="input"
            placeholder="Filter by skills (comma-separated)"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <span className="px-2 py-1 text-sm rounded-full bg-primary-100 text-primary-800">
                  {event.event_type}
                </span>
              </div>
              
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
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
                </div>
                
                <div className="flex items-center text-gray-600">
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
                  {new Date(event.start_date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.skills_required.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No events found matching your filters.
        </div>
      )}
    </div>
  );
};

export default Events; 