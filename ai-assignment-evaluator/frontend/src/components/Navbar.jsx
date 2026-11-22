import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isTeacher, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-blue-900 text-white border-b border-blue-950 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
              AI Assignment Evaluator
            </Link>
            <span className="text-xs bg-blue-800 text-blue-200 px-2 py-0.5 rounded border border-blue-700">
              College Project Portal
            </span>
          </div>

          {isAuthenticated && (
            <nav className="flex items-center space-x-2 text-sm font-medium">
              {isTeacher && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    className={`px-3 py-1.5 rounded transition ${
                      isActive('/teacher/dashboard') ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 text-blue-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/teacher/create-assignment"
                    className={`px-3 py-1.5 rounded transition ${
                      isActive('/teacher/create-assignment') ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 text-blue-100'
                    }`}
                  >
                    Create Assignment
                  </Link>
                  <Link
                    to="/teacher/submissions"
                    className={`px-3 py-1.5 rounded transition ${
                      isActive('/teacher/submissions') ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 text-blue-100'
                    }`}
                  >
                    Submissions & Review
                  </Link>
                  <Link
                    to="/teacher/manage-assignments"
                    className={`px-3 py-1.5 rounded transition ${
                      isActive('/teacher/manage-assignments') ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 text-blue-100'
                    }`}
                  >
                    All Assignments
                  </Link>
                </>
              )}

              {isStudent && (
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-1.5 rounded transition ${
                    isActive('/student/dashboard') ? 'bg-blue-800 text-white' : 'hover:bg-blue-800 text-blue-100'
                  }`}
                >
                  My Dashboard
                </Link>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-3 text-sm">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-semibold text-white leading-none">{user?.name}</div>
                  <div className="text-xs text-blue-200">{isTeacher ? 'Teacher' : 'Student'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-xs transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
                >
                  Login
                </Link>
                <Link
                  to="/login?mode=register"
                  className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-3 py-1.5 rounded text-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
