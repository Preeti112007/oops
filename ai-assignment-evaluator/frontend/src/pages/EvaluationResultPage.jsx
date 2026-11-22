import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evaluationApi, submissionApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ScoreProgressBar } from '../components/ScoreProgressBar';

export const EvaluationResultPage = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();

  const [evaluation, setEvaluation] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullAnswers, setShowFullAnswers] = useState(false);

  useEffect(() => {
    fetchEvaluationData();
  }, [submissionId]);

  const fetchEvaluationData = async () => {
    setLoading(true);
    setError('');
    try {
      const subRes = await submissionApi.getById(submissionId);
      setSubmission(subRes.data);

      try {
        const evalRes = await evaluationApi.getBySubmissionId(submissionId);
        setEvaluation(evalRes.data);
      } catch (err) {
        // Trigger evaluate if not found
        const res = await evaluationApi.evaluate(submissionId, false);
        setEvaluation(res.data);
      }
    } catch (err) {
      setError('Failed to load evaluation results.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">
        <p className="text-base font-bold">Evaluating Submission...</p>
        <p className="text-sm mt-1 text-gray-500">Comparing conceptual ideas with model answer...</p>
      </div>
    );
  }

  if (error && !evaluation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="p-5 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
          <p className="font-bold">Evaluation Error</p>
          <p className="mt-1">{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const effectiveMarks = evaluation?.effectiveMarks !== null ? evaluation.effectiveMarks : evaluation?.marksObtained;
  const effectivePct = evaluation?.effectivePercentage !== null ? evaluation.effectivePercentage : evaluation?.percentage;
  const isReviewed = evaluation?.isReviewedByTeacher;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
        <button
          onClick={() => navigate(isTeacher ? '/teacher/submissions' : '/student/dashboard')}
          className="text-sm text-blue-900 hover:underline font-semibold"
        >
          &larr; Back to {isTeacher ? 'Submissions' : 'Dashboard'}
        </button>

        {isTeacher && (
          <Link
            to={`/teacher/submissions?review=${submissionId}`}
            className="text-xs bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded font-semibold"
          >
            Modify Marks & Review
          </Link>
        )}
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-gray-300 rounded shadow-xs p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="text-xs font-bold uppercase text-blue-900">
              Course: {evaluation?.subject || submission?.subject}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
              {evaluation?.assignmentTitle || submission?.assignmentTitle}
            </h1>
            <div className="text-xs text-gray-600 mt-1">
              Student: <strong>{evaluation?.studentName || submission?.student?.name}</strong> | Submitted: {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div className="text-center sm:text-right bg-gray-50 p-4 border border-gray-300 rounded min-w-[140px]">
            <div className="text-xs text-gray-500 uppercase font-bold">Marks Awarded</div>
            <div className="text-3xl font-bold text-blue-900 mt-0.5">
              {effectiveMarks} <span className="text-base text-gray-600 font-normal">/ {evaluation?.maximumMarks || 10}</span>
            </div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">
              Grade: {effectivePct.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-2">
          <ScoreProgressBar marks={effectiveMarks} maxMarks={evaluation?.maximumMarks || 10} />
        </div>

        {/* Teacher Comment Box (if reviewed) */}
        {isReviewed && (
          <div className="p-3 bg-green-50 border border-green-300 rounded text-xs text-green-900 space-y-1">
            <div className="font-bold">Faculty Review Completed:</div>
            <div>
              Marks approved by instructor: <strong>{evaluation.reviewedMarks} / {evaluation.maximumMarks}</strong>
            </div>
            {evaluation.teacherComments?.length > 0 && (
              <div className="italic">
                Teacher Note: "{evaluation.teacherComments[0].comment}"
              </div>
            )}
          </div>
        )}

      </div>

      {/* Conceptual Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Correct Concepts */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-2">
          <h3 className="text-sm font-bold text-green-800 uppercase border-b border-gray-200 pb-1">
            Correct Concepts Covered
          </h3>
          {evaluation?.correctConcepts?.length > 0 ? (
            <ul className="text-xs text-gray-800 space-y-1.5 list-disc list-inside">
              {evaluation.correctConcepts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No specific conceptual match identified.</p>
          )}
        </div>

        {/* Missing Concepts */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-2">
          <h3 className="text-sm font-bold text-yellow-800 uppercase border-b border-gray-200 pb-1">
            Missing Concepts
          </h3>
          {evaluation?.missingConcepts?.length > 0 ? (
            <ul className="text-xs text-gray-800 space-y-1.5 list-disc list-inside">
              {evaluation.missingConcepts.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-green-700 italic">None! All main concepts were covered.</p>
          )}
        </div>

        {/* Incorrect Concepts */}
        <div className="bg-white border border-gray-300 rounded p-4 space-y-2">
          <h3 className="text-sm font-bold text-red-800 uppercase border-b border-gray-200 pb-1">
            Incorrect Statements / Errors
          </h3>
          {evaluation?.incorrectConcepts?.length > 0 ? (
            <ul className="text-xs text-gray-800 space-y-1.5 list-disc list-inside">
              {evaluation.incorrectConcepts.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-green-700 italic">No factual errors found in the answer.</p>
          )}
        </div>

      </div>

      {/* AI Feedback & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-300 rounded p-5 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-1">
            Detailed AI Feedback
          </h3>
          <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
            {evaluation?.feedback}
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded p-5 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-1">
            Suggestions for Improvement
          </h3>
          <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
            {evaluation?.improvementSuggestions || 'Review the reference materials to further strengthen explanation.'}
          </p>
        </div>
      </div>

      {/* Toggle View Full Submitted Answer */}
      <div className="bg-white border border-gray-300 rounded">
        <button
          onClick={() => setShowFullAnswers(!showFullAnswers)}
          className="w-full p-4 text-left font-bold text-sm text-gray-800 hover:bg-gray-50 flex justify-between items-center"
        >
          <span>View Submitted Answer and Question Text</span>
          <span>{showFullAnswers ? '▲ Hide' : '▼ Expand'}</span>
        </button>

        {showFullAnswers && (
          <div className="p-4 border-t border-gray-200 space-y-4 bg-gray-50 text-xs">
            <div>
              <div className="font-bold text-gray-700 uppercase mb-1">Question:</div>
              <div className="p-2.5 bg-white border border-gray-300 rounded text-gray-900 font-medium">
                {evaluation?.question || submission?.question}
              </div>
            </div>

            <div>
              <div className="font-bold text-gray-700 uppercase mb-1">Student's Submitted Answer:</div>
              <div className="p-2.5 bg-white border border-gray-300 rounded text-gray-900 whitespace-pre-wrap">
                {evaluation?.studentAnswer || submission?.answerText}
              </div>
            </div>

            {isTeacher && evaluation?.referenceAnswer && (
              <div>
                <div className="font-bold text-blue-900 uppercase mb-1">Reference Model Answer (Teacher Only):</div>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-gray-900 whitespace-pre-wrap">
                  {evaluation.referenceAnswer}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
