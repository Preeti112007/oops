import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentApi } from '../api/client';

export const ManageAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await assignmentApi.getAll();
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await assignmentApi.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Failed to delete assignment: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = assignments.filter((a) => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Course Assignments</h1>
          <p className="text-sm text-gray-600 mt-1">
            View all created questions, model answers, and student submissions count.
          </p>
        </div>

        <Link
          to="/teacher/create-assignment"
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded transition"
        >
          + Create New Assignment
        </Link>
      </div>

      <div className="flex justify-between items-center bg-white p-3 border border-gray-300 rounded">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or subject..."
          className="w-full sm:w-80 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
        />
        <span className="text-xs text-gray-500 font-semibold">{filtered.length} Assignment(s)</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600 text-sm">Loading assignments...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((assign) => (
            <div key={assign.id} className="bg-white border border-gray-300 rounded shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start text-xs font-bold text-blue-900 uppercase">
                  <span>{assign.subject}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                    Max: {assign.maximumMarks} Marks
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 mt-2 line-clamp-1">
                  {assign.title}
                </h3>

                <p className="text-xs text-gray-700 mt-2 line-clamp-3 bg-gray-50 p-2.5 rounded border border-gray-200 leading-relaxed">
                  {assign.question}
                </p>

                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <div>Submissions: <strong>{assign.submissionCount || 0}</strong></div>
                  {assign.deadline && (
                    <div>Deadline: {new Date(assign.deadline).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                <Link
                  to={`/teacher/submissions?assignment=${assign.id}`}
                  className="font-bold text-blue-900 hover:underline"
                >
                  View Submissions &rarr;
                </Link>

                {deleteConfirmId === assign.id ? (
                  <div className="space-x-1">
                    <button
                      onClick={() => handleDelete(assign.id)}
                      className="px-2 py-1 bg-red-700 text-white rounded font-bold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(assign.id)}
                    className="text-red-700 hover:underline font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 border border-gray-300 rounded text-center text-gray-500 text-sm">
          No assignments found matching your search.
        </div>
      )}

    </div>
  );
};
