import React from 'react';
import styles from '../styles/TaskStats.module.css';

const TaskStats = ({ stats }) => {
  const total = stats.total || 0;
  const pending = stats.pending || 0;
  const inProgress = stats['in-progress'] || 0;
  const completed = stats.completed || 0;

  const getPercentage = (count) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.statsTitle}>Task Statistics</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{total}</div>
          <div className={styles.statLabel}>Total Tasks</div>
        </div>
        
        <div className={`${styles.statItem} ${styles.pending}`}>
          <div className={styles.statNumber}>{pending}</div>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statPercentage}>{getPercentage(pending)}%</div>
        </div>
        
        <div className={`${styles.statItem} ${styles.inProgress}`}>
          <div className={styles.statNumber}>{inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
          <div className={styles.statPercentage}>{getPercentage(inProgress)}%</div>
        </div>
        
        <div className={`${styles.statItem} ${styles.completed}`}>
          <div className={styles.statNumber}>{completed}</div>
          <div className={styles.statLabel}>Completed</div>
          <div className={styles.statPercentage}>{getPercentage(completed)}%</div>
        </div>
      </div>

      {total > 0 && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressCompleted}
            style={{ width: `${getPercentage(completed)}%` }}
          ></div>
          <div 
            className={styles.progressInProgress}
            style={{ width: `${getPercentage(inProgress)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;

