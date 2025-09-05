import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import styles from '../styles/SearchAndFilter.module.css';

const SearchAndFilter = ({ filters, onFilterChange }) => {
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchKeyword.length >= 2) {
      // Debounce suggestions
      clearTimeout(window.suggestionsTimeout);
      window.suggestionsTimeout = setTimeout(async () => {
        try {
          const data = await taskService.getSearchSuggestions(searchKeyword);
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchKeyword]);

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange({
        ...filters,
        keyword: keyword.trim() || undefined
      });
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchKeyword(suggestion.title);
    setShowSuggestions(false);
    onFilterChange({
      ...filters,
      keyword: suggestion.title
    });
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    onFilterChange({
      ...filters,
      status: status || undefined
    });
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setStatusFilter('');
    setShowSuggestions(false);
    onFilterChange({});
  };

  const hasActiveFilters = searchKeyword || statusFilter;

  return (
    <div className={styles.toolbarRow}>
      <span className={styles.inlineLabel}>Search Tasks</span>
      <div className={styles.searchContainer}>
          <input
            type="text"
            id="search"
            value={searchKeyword}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={styles.searchInput}
            placeholder="Search by title or description..."
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className={styles.suggestionTitle}>
                    {suggestion.title}
                    <span className={styles.matchType}>
                      ({suggestion.matchType})
                    </span>
                  </div>
                  {suggestion.description && (
                    <div className={styles.suggestionDescription}>
                      {suggestion.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      <span className={styles.inlineLabel}>Filter by Status</span>
      <select
          id="status"
          value={statusFilter}
          onChange={handleStatusChange}
          className={styles.statusSelect}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className={styles.clearButton}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchAndFilter;
