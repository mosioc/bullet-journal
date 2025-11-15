class BulletJournal {
  constructor(storageKey = 'bullet-journal-data') {
    this.storageKey = storageKey;
    this.data = this.loadFromStorage() || {
      dailyLogs: {},
      monthlyLogs: {},
      yearlyLogs: {},
      habits: {},
      habitLogs: {}
    };
  }

  // ============ STORAGE METHODS ============
  
  /**
   * Load data from localStorage
   * @returns {Object|null} Parsed journal data or null
   */
  loadFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return null;
    }
  }

  /**
   * Save data to localStorage
   */
  saveToStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  /**
   * Clear all data from storage
   */
  clearStorage() {
    this.data = {
      dailyLogs: {},
      monthlyLogs: {},
      yearlyLogs: {},
      habits: {},
      habitLogs: {}
    };
    this.saveToStorage();
  }

  // ============ DAILY LOG METHODS (Enhanced with Tags & Priority) ============

  /**
   * Add a daily log entry
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} entry - Entry object with tasks, notes, events, tags
   * @returns {Object} The created entry
   */
  addDailyLog(date, entry) {
    if (!this.isValidDate(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const dailyEntry = {
      date,
      tasks: (entry.tasks || []).map(task => this.normalizeTask(task)),
      notes: entry.notes || [],
      events: entry.events || [],
      tags: entry.tags || [],
      timestamp: new Date().toISOString()
    };

    this.data.dailyLogs[date] = dailyEntry;
    this.saveToStorage();
    return dailyEntry;
  }

  /**
   * Normalize task to include priority and status
   * @private
   */
  normalizeTask(task) {
    if (typeof task === 'string') {
      return {
        text: task,
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString()
      };
    }
    return {
      text: task.text || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      createdAt: task.createdAt || new Date().toISOString()
    };
  }

  /**
   * Get a daily log entry
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Object|null} The daily log entry or null
   */
  getDailyLog(date) {
    return this.data.dailyLogs[date] || null;
  }

  /**
   * Update a daily log entry
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} updates - Updates to apply
   * @returns {Object} The updated entry
   */
  updateDailyLog(date, updates) {
    const existing = this.data.dailyLogs[date];
    if (!existing) {
      throw new Error(`No daily log found for ${date}`);
    }

    if (updates.tasks) {
      updates.tasks = updates.tasks.map(task => this.normalizeTask(task));
    }

    this.data.dailyLogs[date] = {
      ...existing,
      ...updates,
      date,
      timestamp: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.data.dailyLogs[date];
  }

  /**
   * Delete a daily log entry
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {boolean} True if deleted
   */
  deleteDailyLog(date) {
    if (this.data.dailyLogs[date]) {
      delete this.data.dailyLogs[date];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get all daily logs
   * @returns {Object} All daily logs
   */
  getAllDailyLogs() {
    return this.data.dailyLogs;
  }

  // ============ TASK MANAGEMENT WITH PRIORITY ============

  /**
   * Update task status
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} taskIndex - Index of task to update
   * @param {string} status - New status: 'todo', 'in-progress', 'completed', 'cancelled'
   * @returns {Object} Updated daily log
   */
  updateTaskStatus(date, taskIndex, status) {
    const log = this.data.dailyLogs[date];
    if (!log) {
      throw new Error(`No daily log found for ${date}`);
    }
    if (!log.tasks[taskIndex]) {
      throw new Error(`Task at index ${taskIndex} not found`);
    }

    const validStatuses = ['todo', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    log.tasks[taskIndex].status = status;
    log.tasks[taskIndex].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    return log;
  }

  /**
   * Update task priority
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} taskIndex - Index of task to update
   * @param {string} priority - New priority: 'low', 'medium', 'high'
   * @returns {Object} Updated daily log
   */
  updateTaskPriority(date, taskIndex, priority) {
    const log = this.data.dailyLogs[date];
    if (!log) {
      throw new Error(`No daily log found for ${date}`);
    }
    if (!log.tasks[taskIndex]) {
      throw new Error(`Task at index ${taskIndex} not found`);
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }

    log.tasks[taskIndex].priority = priority;
    log.tasks[taskIndex].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    return log;
  }

  /**
   * Get tasks by status
   * @param {string} status - Status to filter by
   * @returns {Array} Array of tasks with their dates
   */
  getTasksByStatus(status) {
    const tasks = [];
    Object.entries(this.data.dailyLogs).forEach(([date, log]) => {
      log.tasks.forEach((task, index) => {
        if (task.status === status) {
          tasks.push({ ...task, date, index });
        }
      });
    });
    return tasks;
  }

  /**
   * Get tasks by priority
   * @param {string} priority - Priority to filter by
   * @returns {Array} Array of tasks with their dates
   */
  getTasksByPriority(priority) {
    const tasks = [];
    Object.entries(this.data.dailyLogs).forEach(([date, log]) => {
      log.tasks.forEach((task, index) => {
        if (task.priority === priority) {
          tasks.push({ ...task, date, index });
        }
      });
    });
    return tasks;
  }

  // ============ TAGS AND FILTERING ============

  /**
   * Add tags to a daily log
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Array<string>} tags - Array of tags to add
   * @returns {Object} Updated daily log
   */
  addTags(date, tags) {
    const log = this.data.dailyLogs[date];
    if (!log) {
      throw new Error(`No daily log found for ${date}`);
    }

    const existingTags = new Set(log.tags || []);
    tags.forEach(tag => existingTags.add(tag.toLowerCase()));
    
    log.tags = Array.from(existingTags);
    this.saveToStorage();
    return log;
  }

  /**
   * Remove tags from a daily log
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Array<string>} tags - Array of tags to remove
   * @returns {Object} Updated daily log
   */
  removeTags(date, tags) {
    const log = this.data.dailyLogs[date];
    if (!log) {
      throw new Error(`No daily log found for ${date}`);
    }

    const tagsToRemove = new Set(tags.map(t => t.toLowerCase()));
    log.tags = (log.tags || []).filter(tag => !tagsToRemove.has(tag));
    
    this.saveToStorage();
    return log;
  }

  /**
   * Get logs by tag
   * @param {string} tag - Tag to filter by
   * @returns {Array} Array of daily logs with the tag
   */
  getLogsByTag(tag) {
    const normalizedTag = tag.toLowerCase();
    return Object.entries(this.data.dailyLogs)
      .filter(([_, log]) => (log.tags || []).includes(normalizedTag))
      .map(([date, log]) => ({ date, ...log }));
  }

  /**
   * Get logs by multiple tags (AND operation)
   * @param {Array<string>} tags - Array of tags
   * @returns {Array} Array of daily logs with all tags
   */
  getLogsByTags(tags) {
    const normalizedTags = tags.map(t => t.toLowerCase());
    return Object.entries(this.data.dailyLogs)
      .filter(([_, log]) => {
        const logTags = log.tags || [];
        return normalizedTags.every(tag => logTags.includes(tag));
      })
      .map(([date, log]) => ({ date, ...log }));
  }

  /**
   * Get all unique tags
   * @returns {Array<string>} Array of all tags used
   */
  getAllTags() {
    const tagsSet = new Set();
    Object.values(this.data.dailyLogs).forEach(log => {
      (log.tags || []).forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }

  /**
   * Search logs by keyword in tasks, notes, or events
   * @param {string} keyword - Keyword to search for
   * @returns {Array} Array of matching logs
   */
  searchLogs(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return Object.entries(this.data.dailyLogs)
      .filter(([_, log]) => {
        const tasksMatch = log.tasks.some(task => 
          (typeof task === 'string' ? task : task.text).toLowerCase().includes(lowerKeyword)
        );
        const notesMatch = log.notes.some(note => 
          note.toLowerCase().includes(lowerKeyword)
        );
        const eventsMatch = log.events.some(event => 
          event.toLowerCase().includes(lowerKeyword)
        );
        return tasksMatch || notesMatch || eventsMatch;
      })
      .map(([date, log]) => ({ date, ...log }));
  }

  // ============ HABIT TRACKING ============

  /**
   * Create a new habit
   * @param {string} habitId - Unique ID for the habit
   * @param {Object} habitData - Habit configuration
   * @returns {Object} The created habit
   */
  createHabit(habitId, habitData) {
    if (this.data.habits[habitId]) {
      throw new Error(`Habit with ID ${habitId} already exists`);
    }

    const habit = {
      id: habitId,
      name: habitData.name,
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily', // daily, weekly, monthly
      target: habitData.target || 1, // how many times per period
      tags: habitData.tags || [],
      createdAt: new Date().toISOString()
    };

    this.data.habits[habitId] = habit;
    this.data.habitLogs[habitId] = {};
    this.saveToStorage();
    return habit;
  }

  /**
   * Log a habit completion
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} logData - Optional log data (notes, value)
   * @returns {Object} The habit log entry
   */
  logHabit(habitId, date, logData = {}) {
    if (!this.data.habits[habitId]) {
      throw new Error(`Habit ${habitId} not found`);
    }
    if (!this.isValidDate(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const habitLog = {
      date,
      completed: true,
      notes: logData.notes || '',
      value: logData.value || 1,
      timestamp: new Date().toISOString()
    };

    if (!this.data.habitLogs[habitId]) {
      this.data.habitLogs[habitId] = {};
    }
    
    this.data.habitLogs[habitId][date] = habitLog;
    this.saveToStorage();
    return habitLog;
  }

  /**
   * Get habit by ID
   * @param {string} habitId - Habit ID
   * @returns {Object|null} The habit or null
   */
  getHabit(habitId) {
    return this.data.habits[habitId] || null;
  }

  /**
   * Get all habits
   * @returns {Object} All habits
   */
  getAllHabits() {
    return this.data.habits;
  }

  /**
   * Delete a habit
   * @param {string} habitId - Habit ID
   * @returns {boolean} True if deleted
   */
  deleteHabit(habitId) {
    if (this.data.habits[habitId]) {
      delete this.data.habits[habitId];
      delete this.data.habitLogs[habitId];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get habit logs for a specific habit
   * @param {string} habitId - Habit ID
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   * @returns {Object} Habit logs
   */
  getHabitLogs(habitId, startDate = null, endDate = null) {
    if (!this.data.habitLogs[habitId]) {
      return {};
    }

    const logs = this.data.habitLogs[habitId];
    
    if (!startDate && !endDate) {
      return logs;
    }

    const filtered = {};
    Object.entries(logs).forEach(([date, log]) => {
      if ((!startDate || date >= startDate) && (!endDate || date <= endDate)) {
        filtered[date] = log;
      }
    });

    return filtered;
  }

  /**
   * Calculate habit streak (consecutive days)
   * @param {string} habitId - Habit ID
   * @returns {Object} Streak information
   */
  getHabitStreak(habitId) {
    const logs = this.data.habitLogs[habitId] || {};
    const dates = Object.keys(logs).sort().reverse();
    
    if (dates.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    // Check current streak from today
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (logs[today]) {
      currentStreak = 1;
      let checkDate = yesterday;
      while (logs[checkDate]) {
        currentStreak++;
        const prevDate = new Date(new Date(checkDate).getTime() - 86400000);
        checkDate = prevDate.toISOString().split('T')[0];
      }
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current: currentStreak,
      longest: longestStreak,
      totalCompletions: dates.length
    };
  }

  /**
   * Get habit completion rate
   * @param {string} habitId - Habit ID
   * @param {number} days - Number of days to analyze
   * @returns {Object} Completion statistics
   */
  getHabitStats(habitId, days = 30) {
    const habit = this.data.habits[habitId];
    if (!habit) {
      throw new Error(`Habit ${habitId} not found`);
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days - 1) * 86400000).toISOString().split('T')[0];
    
    const logs = this.getHabitLogs(habitId, startDate, endDate);
    const completedDays = Object.keys(logs).length;
    const completionRate = (completedDays / days) * 100;

    return {
      habitName: habit.name,
      period: days,
      completedDays,
      missedDays: days - completedDays,
      completionRate: Math.round(completionRate * 10) / 10,
      streak: this.getHabitStreak(habitId)
    };
  }

  // ============ MONTHLY LOG METHODS ============

  /**
   * Add a monthly log
   * @param {string} month - Month in YYYY-MM format
   * @param {Object} entry - Entry object with goals, tasks, overview
   * @returns {Object} The created entry
   */
  addMonthlyLog(month, entry) {
    if (!this.isValidMonth(month)) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    const monthlyEntry = {
      month,
      goals: entry.goals || [],
      tasks: entry.tasks || [],
      overview: entry.overview || '',
      highlights: entry.highlights || [],
      timestamp: new Date().toISOString()
    };

    this.data.monthlyLogs[month] = monthlyEntry;
    this.saveToStorage();
    return monthlyEntry;
  }

  /**
   * Get a monthly log
   * @param {string} month - Month in YYYY-MM format
   * @returns {Object|null} The monthly log or null
   */
  getMonthlyLog(month) {
    return this.data.monthlyLogs[month] || null;
  }

  /**
   * Update a monthly log
   * @param {string} month - Month in YYYY-MM format
   * @param {Object} updates - Updates to apply
   * @returns {Object} The updated entry
   */
  updateMonthlyLog(month, updates) {
    const existing = this.data.monthlyLogs[month];
    if (!existing) {
      throw new Error(`No monthly log found for ${month}`);
    }

    this.data.monthlyLogs[month] = {
      ...existing,
      ...updates,
      month,
      timestamp: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.data.monthlyLogs[month];
  }

  /**
   * Delete a monthly log
   * @param {string} month - Month in YYYY-MM format
   * @returns {boolean} True if deleted
   */
  deleteMonthlyLog(month) {
    if (this.data.monthlyLogs[month]) {
      delete this.data.monthlyLogs[month];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get all monthly logs
   * @returns {Object} All monthly logs
   */
  getAllMonthlyLogs() {
    return this.data.monthlyLogs;
  }

  // ============ YEARLY LOG METHODS ============

  /**
   * Add a yearly log
   * @param {string} year - Year in YYYY format
   * @param {Object} entry - Entry object with goals, achievements, overview
   * @returns {Object} The created entry
   */
  addYearlyLog(year, entry) {
    if (!this.isValidYear(year)) {
      throw new Error('Invalid year format. Use YYYY');
    }

    const yearlyEntry = {
      year,
      goals: entry.goals || [],
      achievements: entry.achievements || [],
      overview: entry.overview || '',
      highlights: entry.highlights || [],
      timestamp: new Date().toISOString()
    };

    this.data.yearlyLogs[year] = yearlyEntry;
    this.saveToStorage();
    return yearlyEntry;
  }

  /**
   * Get a yearly log
   * @param {string} year - Year in YYYY format
   * @returns {Object|null} The yearly log or null
   */
  getYearlyLog(year) {
    return this.data.yearlyLogs[year] || null;
  }

  /**
   * Update a yearly log
   * @param {string} year - Year in YYYY format
   * @param {Object} updates - Updates to apply
   * @returns {Object} The updated entry
   */
  updateYearlyLog(year, updates) {
    const existing = this.data.yearlyLogs[year];
    if (!existing) {
      throw new Error(`No yearly log found for ${year}`);
    }

    this.data.yearlyLogs[year] = {
      ...existing,
      ...updates,
      year,
      timestamp: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.data.yearlyLogs[year];
  }

  /**
   * Delete a yearly log
   * @param {string} year - Year in YYYY format
   * @returns {boolean} True if deleted
   */
  deleteYearlyLog(year) {
    if (this.data.yearlyLogs[year]) {
      delete this.data.yearlyLogs[year];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get all yearly logs
   * @returns {Object} All yearly logs
   */
  getAllYearlyLogs() {
    return this.data.yearlyLogs;
  }

  // ============ UTILITY METHODS ============

  /**
   * Validate date format (YYYY-MM-DD)
   * @param {string} date - Date string
   * @returns {boolean} True if valid
   */
  isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  /**
   * Validate month format (YYYY-MM)
   * @param {string} month - Month string
   * @returns {boolean} True if valid
   */
  isValidMonth(month) {
    return /^\d{4}-\d{2}$/.test(month);
  }

  /**
   * Validate year format (YYYY)
   * @param {string} year - Year string
   * @returns {boolean} True if valid
   */
  isValidYear(year) {
    return /^\d{4}$/.test(year);
  }

  /**
   * Export all data as JSON
   * @returns {string} JSON string of all data
   */
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Import data from JSON
   * @param {string} jsonData - JSON string to import
   */
  importData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      this.data = {
        dailyLogs: parsed.dailyLogs || {},
        monthlyLogs: parsed.monthlyLogs || {},
        yearlyLogs: parsed.yearlyLogs || {},
        habits: parsed.habits || {},
        habitLogs: parsed.habitLogs || {}
      };
      this.saveToStorage();
    } catch (error) {
      throw new Error('Invalid JSON data: ' + error.message);
    }
  }

  /**
   * Get statistics about the journal
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      totalDailyLogs: Object.keys(this.data.dailyLogs).length,
      totalMonthlyLogs: Object.keys(this.data.monthlyLogs).length,
      totalYearlyLogs: Object.keys(this.data.yearlyLogs).length,
      totalHabits: Object.keys(this.data.habits).length,
      totalTags: this.getAllTags().length
    };
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BulletJournal;
}

if (typeof window !== 'undefined') {
  window.BulletJournal = BulletJournal;
}

export default BulletJournal;