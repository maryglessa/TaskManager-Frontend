import React, { useState, useEffect } from 'react';
import styles from '../styles/TaskForm.module.css';

const TaskForm = ({ onSubmit, editingTask, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || ''
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      onUpdate(editingTask._id, formData);
    } else {
      onSubmit(formData);
    }
    
    setFormData({
      title: '',
      description: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: ''
    });
    onCancel();
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter task title..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Enter task description..."
            rows={3}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          
          {editingTask && (
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;