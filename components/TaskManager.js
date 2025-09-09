import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SearchAndFilter from './SearchAndFilter';
import taskService from '../services/taskService';
import styles from '../styles/TaskManager.module.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks || data);
    } catch (err) {
      setError('Failed to load tasks. Please check if the backend server is running.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.subtitle}>Organize your tasks efficiently</p>
      </header>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <TaskForm
            onSubmit={handleCreateTask}
            editingTask={editingTask}
            onUpdate={handleUpdateTask}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className={styles.main}>
          <SearchAndFilter
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManager;