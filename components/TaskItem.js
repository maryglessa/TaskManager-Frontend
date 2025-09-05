import React, { useState } from 'react';
import styles from '../styles/TaskItem.module.css';

const TaskItem = ({ task, onEdit, onDelete, onUpdate, onRestore, isTrash = false }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = (newStatus) => {
    onUpdate(task._id, { status: newStatus }, true); // true indicates it's a patch update
  };

  const handleDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in-progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusPending;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`${styles.taskItem} ${getStatusColor(task.status)}`}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={styles.taskActions}>
          {!isTrash && (
            <>
              <button
                onClick={() => onEdit(task)}
                className={styles.editButton}
                title="Edit task"
                disabled={task.status === 'completed'}
              >
                ✏️
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={styles.deleteButton}
                title="Move to trash"
              >
                🗑️
              </button>
            </>
          )}
          {isTrash && (
            <button
              onClick={() => onRestore(task._id)}
              className={styles.editButton}
              title="Restore task"
            >
              ♻️
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}

      <div className={styles.taskMeta}>
        <div className={styles.statusSection}>
          <label className={styles.statusLabel}>Status:</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`${styles.statusSelect} ${getStatusColor(task.status)}`}
            disabled={isTrash || (task.status === 'completed')}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {task.status === 'completed' && (
            <button
              className={styles.reopenButton}
              onClick={() => handleStatusChange('in-progress')}
              disabled={isTrash}
              title="Reopen task to In Progress"
            >
              Reopen
            </button>
          )}
        </div>

        <div className={styles.dateInfo}>
          {task.createdAt && (
            <small className={styles.createdDate}>
              Created: {formatDate(task.createdAt)}
            </small>
          )}
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <small className={styles.updatedDate}>
              Updated: {formatDate(task.updatedAt)}
            </small>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={styles.deleteConfirm}>
          <p>Are you sure you want to delete this task?</p>
          <div className={styles.confirmButtons}>
            <button
              onClick={handleDelete}
              className={styles.confirmDelete}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={styles.cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
