import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

interface EventFormData {
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

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_type: 'hackathon',
    start_date: '',
    end_date: '',
    location: '',
    skills_required: [],
    max_participants: 0,
    registration_deadline: '',
    prize_pool: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'max_participants' || name === 'prize_pool' ? Number(value) : value,
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills_required.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills_required: [...prev.skills_required, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await eventsAPI.createEvent(formData);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Event</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="input"
                required
              >
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
                value={formData.location}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                id="registration_deadline"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                className="input"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="prize_pool" className="block text-sm font-medium text-gray-700 mb-1">
              Prize Pool ($)
            </label>
            <input
              type="number"
              id="prize_pool"
              name="prize_pool"
              value={formData.prize_pool}
              onChange={handleChange}
              className="input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="input"
                placeholder="Add a required skill"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills_required.map((skill) => (
                <span
                  key={skill}
                  className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent; 