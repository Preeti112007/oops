import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { teacherApi, evaluationApi } from '../api/client';

export const TeacherSubmissionsPage = () => {
  const [searchParams] = useSearchParams();
  const reviewSubmissionId = searchParams.get('review');
  const assignmentFilterId = searchParams.get('assignment');

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Review Modal State
  const [selectedSub, setSelectedSub] = useState(null);
  const [reviewMarks, setReviewMarks] = useState('');
  const [teacherComment, setTeacherComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getAllSubmissions();
      setSubmissions(res.data);

      if (reviewSubmissionId) {
        const target = res.data.find((s) => String(s.id) === String(reviewSubmissionId));
        if (target) {
          openReviewModal(target);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (sub) => {
    setSelectedSub(sub);
    setReviewSuccess(false);
    if (sub.evaluation) {
      const currentMarks = sub.evaluation.effectiveMarks !== null ? sub.evaluation.effectiveMarks : sub.evaluation.marksObtained;
      setReviewMarks(String(currentMarks));
      const existingComment = sub.evaluation.teacherComments && sub.evaluation.teacherComments.length > 0 
        ? sub.evaluation.teacherComments[0].comment 
        : '';
      setTeacherComment(existingComment);
    } else {
      setReviewMarks('0');
      setTeacherComment('');
    }
  };

  const closeReviewModal = () => {
    setSelectedSub(null);
    setReviewSuccess(false);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSub || !selectedSub.evaluation) return;

    setSubmittingReview(true);
    try {
      const parsedMarks = parseFloat(reviewMarks);
      const res = await evaluationApi.review(selectedSub.evaluation.id, {
        reviewedMarks: parsedMarks,
        teacherComment: teacherComment.trim(),
      });

      setReviewSuccess(true);
      setSubmissions((prev) =>
        prev.map((s) => {
          if (s.id === selectedSub.id) {
            return {
              ...s,
              status: 'REVIEWED',
              evaluation: res.data,
            };
          }
          return s;
        })
      );

      setTimeout(() => {
        closeReviewModal();
      }, 1000);
    } catch (err) {
      alert('Failed to save review: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await teacherApi.downloadCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assignment_evaluations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = submissions.filter((sub) => {
    const matchesSearch = 
      sub.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    const matchesAssignment = !assignmentFilterId || String(sub.assignmentId) === String(assignmentFilterId);

    return matchesSearch && matchesStatus && matchesAssignment;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Submissions & Evaluation Review</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review AI assigned marks, read student answers, adjust marks and approve final scores.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="mt-3 sm:mt-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm border border-gray-400 rounded transition"
        >
          Export CSV File
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-gray-300 rounded">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name, email or assignment title..."
          className="w-full sm:w-80 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
        />

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 font-semibold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="REVIEWED">Teacher Approved</option>
            <option value="SUBMITTED">Submitted</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-gray-300 rounded shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600 text-sm">Loading submissions list...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Assignment Title</th>
                  <th className="py-2.5 px-3">Submitted On</th>
                  <th className="py-2.5 px-3">AI Marks</th>
                  <th className="py-2.5 px-3">Final Marks</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((sub) => {
                  const ev = sub.evaluation;
                  const aiMarks = ev ? ev.marksObtained : null;
                  const finalMarks = ev ? ev.effectiveMarks : null;
                  const isReviewed = ev ? ev.isReviewedByTeacher : false;

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{sub.student?.name}</div>
                        <div className="text-xs text-gray-500">{sub.student?.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-800">{sub.assignmentTitle}</div>
                        <div className="text-xs text-blue-900">{sub.subject}</div>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-600">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                        <div className="text-gray-400">Attempt #{sub.submissionNumber}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">
                        {aiMarks !== null ? `${aiMarks} / ${sub.maximumMarks || 10}` : 'Pending'}
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-900">
                        {finalMarks !== null ? (
                          <span>
                            {finalMarks} / {sub.maximumMarks || 10}
                            {isReviewed && <span className="ml-1 text-xs text-green-700 font-normal">(Approved)</span>}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          sub.status === 'REVIEWED' ? 'bg-green-100 text-green-800' :
                          sub.status === 'EVALUATED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        {ev && (
                          <Link
                            to={`/evaluations/${sub.id}`}
                            className="text-xs text-blue-900 hover:underline font-semibold"
                          >
                            View
                          </Link>
                        )}
                        <button
                          onClick={() => openReviewModal(sub)}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded"
                        >
                          Review & Grade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No submissions found matching criteria.
          </div>
        )}
      </div>

      {/* Review & Override Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-400 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-300 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Review Submission: {selectedSub.assignmentTitle}
                </h2>
                <p className="text-xs text-gray-600">
                  Student: {selectedSub.student?.name} ({selectedSub.student?.email})
                </p>
              </div>
              <button
                onClick={closeReviewModal}
                className="text-gray-500 hover:text-gray-800 font-bold text-lg px-2"
              >
                &times;
              </button>
            </div>

            {reviewSuccess && (
              <div className="mb-4 p-2.5 bg-green-100 border border-green-300 text-green-800 text-xs rounded font-semibold">
                Marks and comments updated successfully!
              </div>
            )}

            <div className="space-y-4 text-sm">
              
              <div className="bg-gray-50 p-3 border border-gray-200 rounded">
                <div className="text-xs font-bold text-gray-600 uppercase mb-1">Question</div>
                <div className="text-gray-800">{selectedSub.question}</div>
              </div>

              <div className="bg-gray-50 p-3 border border-gray-200 rounded">
                <div className="text-xs font-bold text-gray-600 uppercase mb-1">Student Answer</div>
                <div className="text-gray-800 whitespace-pre-wrap bg-white p-2.5 border border-gray-300 rounded font-normal text-xs">
                  {selectedSub.answerText}
                </div>
              </div>

              {selectedSub.evaluation && (
                <div className="bg-blue-50 p-3 border border-blue-200 rounded space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-blue-900">
                    <span>AI Evaluation Summary</span>
                    <span>AI Marks: {selectedSub.evaluation.marksObtained} / {selectedSub.maximumMarks || 10}</span>
                  </div>
                  <p className="text-xs text-gray-700 italic">
                    "{selectedSub.evaluation.feedback}"
                  </p>
                  {selectedSub.evaluation.correctConcepts?.length > 0 && (
                    <div className="text-xs text-gray-700">
                      <strong>Concepts Covered:</strong> {selectedSub.evaluation.correctConcepts.join(', ')}
                    </div>
                  )}
                  {selectedSub.evaluation.missingConcepts?.length > 0 && (
                    <div className="text-xs text-gray-700">
                      <strong>Missing Points:</strong> {selectedSub.evaluation.missingConcepts.join(', ')}
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSaveReview} className="space-y-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Final Marks (out of {selectedSub.maximumMarks || 10}) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={selectedSub.maximumMarks || 10}
                      required
                      value={reviewMarks}
                      onChange={(e) => setReviewMarks(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Teacher Comments (Optional)
                    </label>
                    <input
                      type="text"
                      value={teacherComment}
                      onChange={(e) => setTeacherComment(e.target.value)}
                      placeholder="e.g. Good explanation, well written."
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded"
                  >
                    {submittingReview ? 'Saving...' : 'Save & Approve Marks'}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
