class BulletJournal {
  constructor(storageKey = 'bullet-journal-data') {
    this.storageKey = storageKey;
    this.data = this.loadFromStorage() || {
      dailyLogs: {},
      monthlyLogs: {},
      yearlyLogs: {}
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
      yearlyLogs: {}
    };
    this.saveToStorage();
  }

  // ============ DAILY LOG METHODS ============

  /**
   * Add a daily log entry
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} entry - Entry object with tasks, notes, events
   * @returns {Object} The created entry
   */
  addDailyLog(date, entry) {
    if (!this.isValidDate(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const dailyEntry = {
      date,
      tasks: entry.tasks || [],
      notes: entry.notes || [],
      events: entry.events || [],
      timestamp: new Date().toISOString()
    };

    this.data.dailyLogs[date] = dailyEntry;
    this.saveToStorage();
    return dailyEntry;
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
        yearlyLogs: parsed.yearlyLogs || {}
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
      totalYearlyLogs: Object.keys(this.data.yearlyLogs).length
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