import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Get all tasks with optional search and filter
  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get a single task by ID
  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Partial update (for status changes)
  async patchTask(id, taskData) {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  },

  // Get soft-deleted tasks (trash)
  async getTrash(filters = {}) {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    const response = await api.get(`/tasks/trash/list?${params.toString()}`);
    return response.data;
  },

  // Restore a soft-deleted task
  async restoreTask(id) {
    const response = await api.patch(`/tasks/${id}/restore`);
    return response.data;
  },

  // Permanently delete a task (use with caution)
  async hardDeleteTask(id) {
    await api.delete(`/tasks/${id}/hard`);
  },

  // Get task statistics
  async getTaskStats() {
    const response = await api.get('/tasks/stats/summary');
    return response.data;
  },

  // Get search suggestions
  async getSearchSuggestions(query) {
    const response = await api.get(`/tasks/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default taskService;
