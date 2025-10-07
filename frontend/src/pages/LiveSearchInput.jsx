import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useDebounce from '../utils/useDebounce'; // Make sure this path to your hook is correct
import { baseUrl1 } from '../utils/services';

// --- SVG Icon Components ---

const SearchIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 text-gray-400" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
);

const Spinner = () => (
  <svg 
    className="animate-spin h-5 w-5 text-gray-500" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    ></circle>
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);


/**
 * A self-contained live search component that fetches and displays results
 * in a dropdown as the user types.
 */
const LiveSearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
  const searchRef = useRef(null);

  // Effect to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm(''); // Clear search to hide dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect to fetch data when the debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
        setResults(response.data.quizzes || []);
      } catch (err) {
        console.error("Search API call failed:", err);
        setError("Failed to fetch results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search for quizzes..."
        className="block w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* --- Results Dropdown --- */}
      {searchTerm && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
          <ul className="max-h-80 overflow-y-auto">
            {isLoading && (
              <li className="px-4 py-3 text-gray-500 flex items-center">
                <Spinner /> <span className="ml-2">Searching...</span>
              </li>
            )}
            {error && <li className="px-4 py-3 text-red-500">{error}</li>}
            {!isLoading && !error && results.length === 0 && debouncedSearchTerm && (
              <li className="px-4 py-3 text-gray-500">No results found for "{debouncedSearchTerm}"</li>
            )}
            {!isLoading && !error && results.map((quiz) => (
              <li key={quiz._id}>
                <Link 
                  to={`/takequiz/${quiz._id}`} 
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setSearchTerm('')} // Clear search and close dropdown on click
                >
                  <img 
                    src={`${quiz.posterImg}`} 
                    alt={quiz.title} 
                    className="h-10 w-16 flex-shrink-0 rounded object-cover bg-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x60/cccccc/ffffff?text=N/A'; }}
                  />
                  <div className="ml-4 overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate">{quiz.title}</p>
                    <p className="text-sm text-gray-500 truncate">by {quiz.createdBy?.name || 'Unknown'}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveSearchInput;