import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    skills: [] as string[],
    location: '',
  });
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.register(formData);
      dispatch(loginSuccess(response));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              I am a
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="student">Student</option>
              <option value="organizer">Event Organizer</option>
              <option value="mentor">Mentor</option>
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
              placeholder="City, Country"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="input"
                placeholder="Add a skill"
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
              {formData.skills.map((skill) => (
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

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 