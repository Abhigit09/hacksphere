import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            HackSphere
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/events" className="text-gray-600 hover:text-primary-600">
              Events
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'organizer' && (
                  <Link
                    to="/create-event"
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Create Event
                  </Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 