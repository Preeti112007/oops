import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [role, setRole] = useState('ROLE_STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const user = await register(name, email, password, role);
        navigate(user.role === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/student/dashboard');
      } else {
        const user = await login(email, password);
        navigate(user.role === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/student/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid credentials or login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (selectedRole) => {
    setError('');
    setIsRegister(false);
    if (selectedRole === 'TEACHER') {
      setEmail('teacher@evaluator.edu');
      setPassword('Password@123');
      setRole('ROLE_TEACHER');
    } else {
      setEmail('sarah@student.edu');
      setPassword('Password@123');
      setRole('ROLE_STUDENT');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
        
        <div className="text-center pb-4 mb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegister ? 'Student & Teacher Registration' : 'Assignment Portal Login'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Department of Computer Science & Engineering
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
            {error}
          </div>
        )}

        <div className="flex border-b border-gray-200 mb-5">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 ${
              !isRegister ? 'border-blue-800 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 ${
              isRegister ? 'border-blue-800 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-800"
              >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
              </select>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-800"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@college.edu"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded text-sm transition"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2 text-center">Demo Test Accounts:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('TEACHER')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-800 text-center"
            >
              Teacher: Prof. Turing
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('STUDENT')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-800 text-center"
            >
              Student: Sarah Connor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
