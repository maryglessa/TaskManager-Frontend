import React, { useState } from 'react';
import styles from '../styles/SearchAndFilter.module.css';

const SearchAndFilter = ({ filters, onFilterChange }) => {
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

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
    onFilterChange({});
  };

  const hasActiveFilters = searchKeyword || statusFilter;

  return (
    <div className={styles.toolbarRow}>
      <span className={styles.inlineLabel}>Search Tasks</span>
      <input
        type="text"
        value={searchKeyword}
        onChange={handleSearchChange}
        className={styles.searchInput}
        placeholder="Search by title or description..."
      />

      <span className={styles.inlineLabel}>Filter by Status</span>
      <select
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