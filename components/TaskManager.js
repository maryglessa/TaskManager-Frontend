import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SearchAndFilter from './SearchAndFilter';
import TaskStats from './TaskStats';
import taskService from '../services/taskService';
import styles from '../styles/TaskManager.module.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({});
  const [isTrashMode, setIsTrashMode] = useState(false);

  // Load tasks on component mount and when filters change
  useEffect(() => {
    loadTasks();
    loadStats();
  }, [filters, isTrashMode]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isTrashMode
        ? await taskService.getTrash(filters)
        : await taskService.getTasks(filters);
      setTasks(data.tasks || data);
    } catch (err) {
      setError('Failed to load tasks. Please check if the backend server is running.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await taskService.getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setError(null);
      loadStats(); // Refresh stats
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, taskData, isPatch = false) => {
    try {
      const updatedTask = isPatch 
        ? await taskService.patchTask(id, taskData)
        : await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      setEditingTask(null);
      setError(null);
      loadStats(); // Refresh stats
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
      loadStats(); // Refresh stats
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      await taskService.restoreTask(id);
      // Remove from current trash list
      setTasks(prev => prev.filter(task => task._id !== id));
      setError(null);
      loadStats();
    } catch (err) {
      setError('Failed to restore task');
      console.error('Error restoring task:', err);
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

          <TaskStats stats={stats} />
        </div>

        <div className={styles.main}>
          <div className={styles.toolbarRowTop}>
            <button
              className={styles.secondaryButton}
              onClick={() => setIsTrashMode(false)}
              disabled={!isTrashMode}
              title="Show active tasks"
            >
              Tasks
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setIsTrashMode(true)}
              disabled={isTrashMode}
              title="Show deleted tasks (Trash)"
            >
              Trash
            </button>
          </div>
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
            onRestore={handleRestoreTask}
            isTrash={isTrashMode}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
