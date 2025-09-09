import React from 'react';
import TaskItem from './TaskItem';
import styles from '../styles/TaskList.module.css';

const TaskList = ({ tasks, loading, onEdit, onDelete, onUpdate }) => {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tasks ({tasks.length})</h2>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <div className={styles.taskGrid}>
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;