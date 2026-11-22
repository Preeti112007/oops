import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assignmentApi, submissionApi } from '../api/client';

export const SubmitAssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const res = await assignmentApi.getById(assignmentId);
      setAssignment(res.data);

      const subRes = await submissionApi.getByAssignment(assignmentId);
      setPreviousSubmissions(subRes.data);
    } catch (err) {
      setError('Unable to fetch assignment details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setError('Answer field cannot be empty.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await submissionApi.submit(parseInt(assignmentId), answerText.trim());
      setSubmittedId(res.data.id);
      setTimeout(() => {
        navigate(`/evaluations/${res.data.id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit answer.');
      setSubmitting(false);
    }
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-600">
        Loading question...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-700 font-bold mb-3">Assignment not found.</p>
        <Link to="/student/dashboard" className="text-blue-900 underline text-sm">
          Return to Student Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
        <Link to="/student/dashboard" className="text-sm text-blue-900 hover:underline font-semibold">
          &larr; Back to Dashboard
        </Link>
        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded border border-gray-300 font-bold">
          Maximum Marks: {assignment.maximumMarks}
        </span>
      </div>

      {/* Question Details */}
      <div className="bg-white border border-gray-300 rounded shadow-xs p-5 space-y-3">
        <div className="text-xs font-bold uppercase text-blue-900">
          Course: {assignment.subject}
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {assignment.title}
        </h1>

        <div className="bg-gray-50 p-4 border border-gray-200 rounded text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          <div className="text-xs font-bold text-gray-500 uppercase mb-1">Question Prompt:</div>
          {assignment.question}
        </div>

        {assignment.keywordsCriteria && (
          <div className="text-xs text-gray-600 bg-yellow-50 p-2.5 border border-yellow-200 rounded">
            <strong>Key Criteria / Concepts Expected:</strong> {assignment.keywordsCriteria}
          </div>
        )}
      </div>

      {submittedId && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded font-semibold">
          Answer submitted successfully. Evaluation completed. Redirecting to evaluation report...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      {/* Answer Form */}
      <div className="bg-white border border-gray-300 rounded shadow-xs p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <label className="font-bold uppercase text-gray-700">Write Your Answer:</label>
            <span>Words: {wordCount} | Characters: {answerText.length}</span>
          </div>

          <textarea
            required
            rows={10}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your complete conceptual answer here..."
            className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900 leading-relaxed"
          />

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Note: Multiple submission attempts are allowed.
            </span>
            <button
              type="submit"
              disabled={submitting || !!submittedId || !answerText.trim()}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded transition"
            >
              {submitting ? 'Evaluating Answer...' : 'Submit Answer'}
            </button>
          </div>
        </form>
      </div>

      {/* Previous Submissions List */}
      {previousSubmissions.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
            Previous Attempts for this Assignment
          </h3>
          <div className="space-y-2">
            {previousSubmissions.map((sub) => {
              const marks = sub.evaluation 
                ? (sub.evaluation.effectiveMarks !== null ? sub.evaluation.effectiveMarks : sub.evaluation.marksObtained)
                : null;
              return (
                <div key={sub.id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-200 rounded text-xs">
                  <div>
                    <span className="font-bold text-gray-800">Attempt #{sub.submissionNumber}</span>
                    <span className="text-gray-500 ml-2">({new Date(sub.submittedAt).toLocaleDateString()})</span>
                  </div>
                  <div className="space-x-3">
                    {marks !== null && (
                      <span className="font-bold text-blue-900">Score: {marks}/{sub.maximumMarks || 10}</span>
                    )}
                    <Link to={`/evaluations/${sub.id}`} className="text-blue-900 underline font-semibold">
                      View Report
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
