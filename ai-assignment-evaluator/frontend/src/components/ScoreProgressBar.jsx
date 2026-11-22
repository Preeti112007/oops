import React from 'react';

export const ScoreProgressBar = ({ marks, maxMarks = 10, size = 'md' }) => {
  const percentage = Math.min(100, Math.max(0, (marks / maxMarks) * 100));

  let barColor = 'bg-green-600';
  if (percentage < 40) barColor = 'bg-red-600';
  else if (percentage < 70) barColor = 'bg-yellow-500';

  if (size === 'circle') {
    return (
      <div className="border-4 border-blue-900 rounded-full w-24 h-24 flex flex-col items-center justify-center bg-gray-50 shadow-inner">
        <span className="text-2xl font-bold text-gray-900 leading-tight">{marks}</span>
        <span className="text-xs text-gray-600 font-medium">out of {maxMarks}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
        <span>Score: {marks} / {maxMarks}</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-2.5 overflow-hidden border border-gray-300">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
