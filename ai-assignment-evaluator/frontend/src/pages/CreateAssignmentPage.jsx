import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentApi } from '../api/client';

export const CreateAssignmentPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    question: '',
    referenceAnswer: '',
    maximumMarks: 10,
    keywordsCriteria: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        maximumMarks: parseInt(formData.maximumMarks) || 10,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      await assignmentApi.create(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/teacher/manage-assignments');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleQuestion = () => {
    setFormData({
      title: 'Difference between TCP and UDP Protocols',
      subject: 'Computer Networks',
      question: 'Compare and contrast Transmission Control Protocol (TCP) and User Datagram Protocol (UDP). Mention their key differences with respect to connection orientation, reliability, speed, and standard use cases.',
      referenceAnswer: 'TCP is a connection-oriented, reliable protocol that uses a three-way handshake (SYN, SYN-ACK, ACK) and provides error checking, flow control, and guaranteed in-order delivery of packets, making it ideal for web browsing (HTTP/HTTPS), file transfer (FTP), and email (SMTP). In contrast, UDP is a connectionless, unreliable datagram protocol that does not guarantee delivery, packet order, or error recovery, resulting in minimal overhead and high transmission speed, making it suitable for real-time applications like video streaming, VoIP, DNS lookups, and online gaming.',
      maximumMarks: 10,
      keywordsCriteria: 'Connection-oriented vs Connectionless, Reliability/guaranteed delivery, Three-way handshake, Header overhead & transmission speed, Real-world use cases (HTTP/HTTPS vs VoIP/Streaming).',
      deadline: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
        <button
          type="button"
          onClick={loadSampleQuestion}
          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded border border-gray-400 font-semibold"
        >
          Load Sample Assignment
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
          Assignment created successfully. Redirecting...
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Assignment Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Operating System Deadlocks"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Operating Systems"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Assignment Question *
            </label>
            <textarea
              name="question"
              required
              rows={4}
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the full question for the students..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Teacher Reference Answer (Model Answer) *
            </label>
            <textarea
              name="referenceAnswer"
              required
              rows={6}
              value={formData.referenceAnswer}
              onChange={handleChange}
              placeholder="Enter the ideal reference answer. The AI will evaluate student submissions against this reference answer."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Students will not see this reference answer directly. It is used as the ground truth for grading.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Evaluation Criteria / Keywords (Optional)
            </label>
            <input
              type="text"
              name="keywordsCriteria"
              value={formData.keywordsCriteria}
              onChange={handleChange}
              placeholder="e.g. Mutual exclusion, Hold and wait, No preemption, Circular wait"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Maximum Marks
              </label>
              <input
                type="number"
                min="1"
                max="100"
                name="maximumMarks"
                value={formData.maximumMarks}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
              />
              <span className="text-xs text-gray-500">Default is 10 marks.</span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Submission Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded text-sm transition"
            >
              {loading ? 'Saving...' : 'Save & Publish Assignment'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
