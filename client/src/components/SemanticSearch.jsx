import { useState, useEffect } from 'react';
import './SemanticSearch.css';

const SemanticSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        onSearch(query);
        setTimeout(() => setIsSearching(false), 500);
      } else {
        onSearch('');
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // Only depend on query, not onSearch

  return (
    <div className="semantic-search">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input input"
          placeholder="Search by concept or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSearching && <div className="search-spinner spinner-small"></div>}
        {query && (
          <button
            className="clear-search"
            onClick={() => setQuery('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {query && (
        <small className="search-hint">
          🔍 Searching across titles and descriptions
        </small>
      )}
    </div>
  );
};

export default SemanticSearch;
