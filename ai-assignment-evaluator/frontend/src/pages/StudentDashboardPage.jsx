import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentApi, submissionApi } from '../api/client';

export const StudentDashboardPage = () => {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [assignRes, subRes] = await Promise.all([
        assignmentApi.getAll(),
        submissionApi.getByStudent(user.id)
      ]);
      setAssignments(assignRes.data);
      setSubmissions(subRes.data);
    } catch (err) {
      setError('Could not load student data.');
    } finally {
      setLoading(false);
    }
  };

  const evaluatedSubs = submissions.filter((s) => s.evaluation && s.status !== 'SUBMITTED');
  const totalScore = evaluatedSubs.reduce((acc, s) => {
    const marks = s.evaluation.effectiveMarks !== null ? s.evaluation.effectiveMarks : s.evaluation.marksObtained;
    return acc + (marks || 0);
  }, 0);
  const avgScore = evaluatedSubs.length > 0 ? (totalScore / evaluatedSubs.length).toFixed(1) : null;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600">
        Loading student dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div className="bg-white border border-gray-300 p-5 rounded shadow-xs">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Portal: {user?.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome to the assignment evaluation system. Complete questions below and receive automated conceptual AI feedback.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-300 rounded">
          <div className="text-xs uppercase text-gray-500 font-bold">Available Assignments</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{assignments.length}</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded">
          <div className="text-xs uppercase text-gray-500 font-bold">My Submissions</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{submissions.length}</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded">
          <div className="text-xs uppercase text-gray-500 font-bold">Evaluated Answers</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{evaluatedSubs.length}</div>
        </div>

        <div className="bg-white p-4 border border-gray-300 rounded">
          <div className="text-xs uppercase text-gray-500 font-bold">My Average Score</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {avgScore ? `${avgScore} / 10` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Available Assignments */}
      <div className="bg-white border border-gray-300 rounded p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
          Available Course Assignments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assign) => (
            <div key={assign.id} className="border border-gray-300 rounded p-4 bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-bold text-blue-900 uppercase">
                  <span>{assign.subject}</span>
                  <span>Max: {assign.maximumMarks} Marks</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mt-2 line-clamp-1">{assign.title}</h3>
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-3 bg-white p-2 border border-gray-200 rounded">
                  {assign.question}
                </p>
                {assign.deadline && (
                  <div className="text-xs text-gray-500 mt-2">
                    Deadline: {new Date(assign.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200 flex justify-end">
                <Link
                  to={`/student/submit/${assign.id}`}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded"
                >
                  Write & Submit Answer &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submission History Table */}
      <div className="bg-white border border-gray-300 rounded p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
          My Previous Submissions & Results
        </h2>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700">
                  <th className="py-2.5 px-3">Assignment Title</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Submitted On</th>
                  <th className="py-2.5 px-3">Marks Obtained</th>
                  <th className="py-2.5 px-3">Evaluation Status</th>
                  <th className="py-2.5 px-3 text-right">View Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((sub) => {
                  const ev = sub.evaluation;
                  const marks = ev ? (ev.effectiveMarks !== null ? ev.effectiveMarks : ev.marksObtained) : null;
                  const isReviewed = ev ? ev.isReviewedByTeacher : false;

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-semibold text-gray-900">
                        {sub.assignmentTitle}
                        <span className="text-xs text-gray-400 font-normal ml-2">(Attempt #{sub.submissionNumber})</span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{sub.subject}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-900">
                        {marks !== null ? `${marks} / ${sub.maximumMarks || 10}` : 'Pending'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          sub.status === 'REVIEWED' ? 'bg-green-100 text-green-800' :
                          sub.status === 'EVALUATED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isReviewed ? 'Teacher Approved' : sub.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          to={`/evaluations/${sub.id}`}
                          className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 px-3 py-1 rounded inline-block font-semibold"
                        >
                          View Results
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">
            You haven't submitted any answers yet. Select an assignment above to submit.
          </p>
        )}
      </div>

    </div>
  );
};
