import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherApi, assignmentApi } from '../api/client';

export const TeacherDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, assignRes] = await Promise.all([
        teacherApi.getDashboardStats(),
        assignmentApi.getAll()
      ]);
      setStats(statsRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      setError('Unable to load teacher dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await teacherApi.downloadCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluations_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting CSV.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600">
        Loading dashboard data, please wait...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of course assignments, submissions, and marks evaluation.
          </p>
        </div>

        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400 rounded"
          >
            Export CSV Report
          </button>
          <Link
            to="/teacher/create-assignment"
            className="px-4 py-2 text-sm font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded"
          >
            + Create Assignment
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-300 rounded shadow-xs">
          <div className="text-xs uppercase text-gray-500 font-bold">Total Students</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalStudents || 0}</div>
          <div className="text-xs text-gray-600 mt-1">Registered in system</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded shadow-xs">
          <div className="text-xs uppercase text-gray-500 font-bold">Assignments Created</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalAssignments || 0}</div>
          <div className="text-xs text-gray-600 mt-1">Active questions</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded shadow-xs">
          <div className="text-xs uppercase text-gray-500 font-bold">Evaluated Submissions</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalEvaluatedSubmissions || 0}</div>
          <div className="text-xs text-gray-600 mt-1">Assessed by AI</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded shadow-xs">
          <div className="text-xs uppercase text-gray-500 font-bold">Class Average</div>
          <div className="text-3xl font-bold text-blue-900 mt-1">
            {stats?.averageClassMarks ? `${stats.averageClassMarks} / 10` : 'N/A'}
          </div>
          <div className="text-xs text-gray-600 mt-1">Based on evaluated submissions</div>
        </div>
      </div>

      {/* Main Grid: Recent Submissions & Course List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Activity */}
        <div className="lg:col-span-8 bg-white border border-gray-300 rounded shadow-xs p-5">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Student Submissions</h2>
            <Link to="/teacher/submissions" className="text-xs font-semibold text-blue-900 hover:underline">
              View All Submissions &rarr;
            </Link>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700">
                    <th className="py-2 px-3">Student</th>
                    <th className="py-2 px-3">Assignment</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentActivity.map((sub) => {
                    const ev = sub.evaluation;
                    const marks = ev ? (ev.effectiveMarks !== null ? ev.effectiveMarks : ev.marksObtained) : null;
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-gray-900">{sub.student?.name}</div>
                          <div className="text-xs text-gray-500">{sub.student?.email}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-gray-800">{sub.assignmentTitle}</div>
                          <div className="text-xs text-gray-500">{sub.subject}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-gray-800">
                          {marks !== null ? `${marks} / ${sub.maximumMarks || 10}` : 'Pending'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            sub.status === 'REVIEWED' ? 'bg-green-100 text-green-800' :
                            sub.status === 'EVALUATED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Link
                            to={`/teacher/submissions?review=${sub.id}`}
                            className="text-xs bg-blue-900 hover:bg-blue-800 text-white px-2.5 py-1 rounded inline-block"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-6 text-center">No student submissions recorded yet.</p>
          )}
        </div>

        {/* Right: Quick List of Assignments */}
        <div className="lg:col-span-4 bg-white border border-gray-300 rounded shadow-xs p-5">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Course Assignments</h2>
            <Link to="/teacher/manage-assignments" className="text-xs font-semibold text-blue-900 hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 5).map((a) => (
              <div key={a.id} className="p-3 border border-gray-200 rounded bg-gray-50">
                <div className="text-xs text-blue-900 font-bold uppercase">{a.subject}</div>
                <div className="font-semibold text-sm text-gray-900 mt-0.5">{a.title}</div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Max: {a.maximumMarks} Marks</span>
                  <span>{a.submissionCount || 0} Submissions</span>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No assignments created yet.</p>
            )}
          </div>

          <Link
            to="/teacher/create-assignment"
            className="mt-4 block text-center py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-xs rounded"
          >
            + Create New Assignment
          </Link>
        </div>

      </div>

    </div>
  );
};
