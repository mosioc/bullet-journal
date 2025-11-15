# @mosioc/bullet-journal

A simple, lightweight vanilla JavaScript bullet journal library for managing daily, monthly, and yearly logs with localStorage persistence, habit tracking, tags, and priority management.

## Features

- **Daily Logs** - Track tasks, notes, and events for specific dates
- **Monthly Logs** - Manage monthly goals, tasks, and highlights
- **Yearly Logs** - Set and track yearly goals and achievements
- **Habit Tracking** - Create habits, track completions, and view streaks
- **Tags & Filtering** - Organize and find entries with tags
- **Priority Levels** - Set task priorities (low, medium, high)
- **Task Status** - Track task progress (todo, in-progress, completed, cancelled)
- **Search** - Find entries by keywords
- **localStorage Support** - Automatic persistence in the browser
- **Zero Dependencies** - Pure vanilla JavaScript
- **Lightweight** - Minimal footprint
- **Import/Export** - Easy data backup and migration

## Installation

### From GitHub Packages

First, configure npm to use GitHub Packages for the `@mosioc` scope. Create or edit `~/.npmrc`:

```bash
@mosioc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @mosioc/bullet-journal
```

### Using a CDN (Browser)

```html
<script src="https://cdn.jsdelivr.net/npm/@mosioc/bullet-journal/dist/index.min.js"></script>
```

## What's New in v1.5.0

**Habit Tracking** - Create and track daily habits with streak counting
**Tags** - Organize entries with tags and filter by tags
**Priority Levels** - Assign priorities to tasks (low, medium, high)
**Task Status** - Track task progress through different states
**Search** - Search across all entries

## Quick Start

```javascript
import BulletJournal from '@mosioc/bullet-journal';

const journal = new BulletJournal();

// Add a daily log with tasks, priorities, and tags
journal.addDailyLog('2025-11-15', {
  tasks: [
    { text: 'Complete project', priority: 'high' },
    { text: 'Review code', priority: 'medium' },
    { text: 'Update docs', priority: 'low' }
  ],
  notes: ['Great progress today'],
  tags: ['work', 'productive']
});

// Create a habit
journal.createHabit('exercise', {
  name: 'Daily Exercise',
  description: '30 minutes of workout',
  frequency: 'daily',
  target: 1
});

// Log habit completion
journal.logHabit('exercise', '2025-11-15');
```

## API Reference

### Daily Logs with Priority & Tags

#### Add a Daily Log

```javascript
journal.addDailyLog('2025-11-15', {
  tasks: [
    'Simple task string',  // defaults to medium priority
    { 
      text: 'Important task',
      priority: 'high',  // low, medium, high
      status: 'todo'     // todo, in-progress, completed, cancelled
    }
  ],
  notes: ['Note 1', 'Note 2'],
  events: ['Meeting at 2pm'],
  tags: ['work', 'important']
});
```

#### Update Task Status

```javascript
// Mark first task as completed
journal.updateTaskStatus('2025-11-15', 0, 'completed');

// Mark second task as in-progress
journal.updateTaskStatus('2025-11-15', 1, 'in-progress');
```

#### Update Task Priority

```javascript
// Change priority of first task to high
journal.updateTaskPriority('2025-11-15', 0, 'high');
```

#### Get Tasks by Status

```javascript
const completedTasks = journal.getTasksByStatus('completed');
const todoTasks = journal.getTasksByStatus('todo');
```

#### Get Tasks by Priority

```javascript
const highPriorityTasks = journal.getTasksByPriority('high');
const mediumPriorityTasks = journal.getTasksByPriority('medium');
```

### Tags & Filtering

#### Add Tags to Entry

```javascript
journal.addTags('2025-11-15', ['work', 'productive', 'meeting']);
```

#### Remove Tags

```javascript
journal.removeTags('2025-11-15', ['meeting']);
```

#### Get Logs by Tag

```javascript
const workLogs = journal.getLogsByTag('work');
```

#### Get Logs by Multiple Tags

```javascript
// Get logs that have BOTH 'work' AND 'productive' tags
const logs = journal.getLogsByTags(['work', 'productive']);
```

#### Get All Tags

```javascript
const allTags = journal.getAllTags();
// ['work', 'personal', 'productive', ...]
```

#### Search Logs

```javascript
// Search for keyword in tasks, notes, and events
const results = journal.searchLogs('meeting');
```

### Habit Tracking

#### Create a Habit

```javascript
journal.createHabit('meditation', {
  name: 'Daily Meditation',
  description: '10 minutes of mindfulness',
  frequency: 'daily',
  target: 1,
  tags: ['health', 'mindfulness']
});
```

#### Log Habit Completion

```javascript
// Simple completion
journal.logHabit('meditation', '2025-11-15');

// With notes and custom value
journal.logHabit('meditation', '2025-11-15', {
  notes: 'Felt very focused today',
  value: 15  // minutes
});
```

#### Get Habit Information

```javascript
const habit = journal.getHabit('meditation');
const allHabits = journal.getAllHabits();
```

#### Get Habit Logs

```javascript
// All logs for a habit
const logs = journal.getHabitLogs('meditation');

// Logs within date range
const logs = journal.getHabitLogs('meditation', '2025-11-01', '2025-11-15');
```

#### Get Habit Streak

```javascript
const streak = journal.getHabitStreak('meditation');
console.log(streak);
// {
//   current: 7,           // 7 days in a row
//   longest: 15,          // longest streak ever
//   totalCompletions: 45  // total times completed
// }
```

#### Get Habit Statistics

```javascript
const stats = journal.getHabitStats('meditation', 30);  // last 30 days
console.log(stats);
// {
//   habitName: 'Daily Meditation',
//   period: 30,
//   completedDays: 25,
//   missedDays: 5,
//   completionRate: 83.3,
//   streak: { current: 7, longest: 15, totalCompletions: 25 }
// }
```

#### Delete a Habit

```javascript
journal.deleteHabit('meditation');
```

### Monthly & Yearly Logs

Monthly and yearly logs work the same as in v1.0.0:

```javascript
// Monthly log
journal.addMonthlyLog('2025-11', {
  goals: ['Goal 1', 'Goal 2'],
  tasks: ['Task 1', 'Task 2'],
  overview: 'Great month',
  highlights: ['Highlight 1']
});

// Yearly log
journal.addYearlyLog('2025', {
  goals: ['Learn new skill', 'Build project'],
  achievements: [],
  overview: 'Year of growth'
});
```

### Utility Methods

#### Get Statistics

```javascript
const stats = journal.getStats();
// {
//   totalDailyLogs: 30,
//   totalMonthlyLogs: 3,
//   totalYearlyLogs: 1,
//   totalHabits: 5,
//   totalTags: 12
// }
```

#### Export/Import Data

```javascript
// Export
const backup = journal.exportData();

// Import
journal.importData(backup);
```

#### Clear All Data

```javascript
journal.clearStorage();
```

## Complete Examples

### Example 1: Task Management with Priorities

```javascript
const journal = new BulletJournal();

// Add tasks with different priorities
journal.addDailyLog('2025-11-15', {
  tasks: [
    { text: 'Fix critical bug', priority: 'high' },
    { text: 'Review pull request', priority: 'medium' },
    { text: 'Update README', priority: 'low' }
  ],
  tags: ['work', 'development']
});

// Update task status as you work
journal.updateTaskStatus('2025-11-15', 0, 'in-progress');
journal.updateTaskStatus('2025-11-15', 0, 'completed');

// Get all high priority tasks
const urgentTasks = journal.getTasksByPriority('high');

// Get incomplete tasks
const todoTasks = journal.getTasksByStatus('todo');
```

### Example 2: Habit Tracking Workflow

```javascript
const journal = new BulletJournal();

// Create multiple habits
journal.createHabit('exercise', {
  name: 'Morning Exercise',
  description: '30 min workout',
  frequency: 'daily'
});

journal.createHabit('reading', {
  name: 'Daily Reading',
  description: 'Read for 20 minutes',
  frequency: 'daily'
});

// Log completions
journal.logHabit('exercise', '2025-11-15');
journal.logHabit('reading', '2025-11-15', {
  notes: 'Finished chapter 3',
  value: 25
});

// Check progress
const exerciseStreak = journal.getHabitStreak('exercise');
console.log(`Current streak: ${exerciseStreak.current} days`);

const stats = journal.getHabitStats('reading', 7);
console.log(`This week: ${stats.completionRate}% completion rate`);
```

### Example 3: Organization with Tags

```javascript
const journal = new BulletJournal();

// Create categorized entries
journal.addDailyLog('2025-11-15', {
  tasks: ['Morning standup', 'Code review'],
  tags: ['work', 'development']
});

journal.addDailyLog('2025-11-16', {
  tasks: ['Grocery shopping', 'Gym'],
  tags: ['personal', 'health']
});

// Find all work-related entries
const workEntries = journal.getLogsByTag('work');

// Find entries with multiple tags
const healthWork = journal.getLogsByTags(['work', 'health']);

// Search across all entries
const meetings = journal.searchLogs('meeting');

// See all tags you've used
const allTags = journal.getAllTags();
console.log('Your tags:', allTags);
```

### Example 4: Complete Daily Workflow

```javascript
const journal = new BulletJournal();

// Morning: Plan your day
const today = new Date().toISOString().split('T')[0];

journal.addDailyLog(today, {
  tasks: [
    { text: 'Team standup', priority: 'high', status: 'todo' },
    { text: 'Write documentation', priority: 'medium', status: 'todo' },
    { text: 'Review PRs', priority: 'low', status: 'todo' }
  ],
  notes: ['Focus on documentation today'],
  events: ['1:1 with manager at 3pm'],
  tags: ['work', 'productive']
});

// Throughout the day: Update progress
journal.updateTaskStatus(today, 0, 'completed');
journal.updateTaskStatus(today, 1, 'in-progress');

// Log habits
journal.logHabit('exercise', today);
journal.logHabit('meditation', today);

// Evening: Review
const todayLog = journal.getDailyLog(today);
const completedCount = todayLog.tasks.filter(t => t.status === 'completed').length;
console.log(`Completed ${completedCount} tasks today!`);

// Check habit streaks
const exerciseStreak = journal.getHabitStreak('exercise');
console.log(`Exercise streak: ${exerciseStreak.current} days`);
```

## Data Structure

### Task Object

```javascript
{
  text: "Task description",
  priority: "high",        // low, medium, high
  status: "todo",          // todo, in-progress, completed, cancelled
  createdAt: "2025-11-15T10:00:00.000Z",
  updatedAt: "2025-11-15T12:00:00.000Z"
}
```

### Daily Log with Tags

```javascript
{
  date: "2025-11-15",
  tasks: [...],
  notes: [...],
  events: [...],
  tags: ["work", "productive"],
  timestamp: "2025-11-15T10:00:00.000Z"
}
```

### Habit Structure

```javascript
{
  id: "exercise",
  name: "Daily Exercise",
  description: "30 minutes workout",
  frequency: "daily",
  target: 1,
  tags: ["health"],
  createdAt: "2025-11-01T10:00:00.000Z"
}
```

## Migration from v1.0.0

If you're upgrading from v1.0.0, your existing data will continue to work! The new version:

- Backwards compatible with v1.0.0 data
- Existing tasks will default to `medium` priority
- Existing tasks will default to `todo` status
- New fields are optional

Simply update your package and start using the new features:

```bash
npm update @mosioc/bullet-journal
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 classes
- localStorage API
- JSON methods

## Changelog

### v1.5.0 
- Added habit tracking with streak calculation
- Added tags and filtering for entries
- Added priority levels for tasks (low, medium, high)
- Added task status management (todo, in-progress, completed, cancelled)
- Added search functionality
- Enhanced statistics with habit and tag counts

### v1.0.0 (2025-11-15)
- Initial release
- Daily, monthly, and yearly logs
- localStorage persistence
- Import/export functionality
