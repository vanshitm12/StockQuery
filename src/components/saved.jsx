import React, { useEffect, useState } from 'react';

const SavedQueries = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedQueries')) || [];
    setQueries(saved);
  }, []);

  const copyToClipboard = (query) => {
    navigator.clipboard.writeText(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-8 font-['Inter']">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">📜 Saved Queries</h1>

        {queries.length === 0 ? (
          <p className="text-gray-500">No saved queries found.</p>
        ) : (
          <ul className="space-y-4">
            {queries.map((query, index) => (
              <li
                key={index}
                className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="text-gray-700">{query}</span>
                <button
                  onClick={() => copyToClipboard(query)}
                  className="ml-4 text-sm bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedQueries;
