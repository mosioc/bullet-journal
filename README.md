# @mosioc/bullet-journal

A simple, lightweight vanilla JavaScript bullet journal library for managing daily, monthly, and yearly logs with localStorage persistence.

## Features

- **Daily Logs** - Track tasks, notes, and events for specific dates
- **Monthly Logs** - Manage monthly goals, tasks, and highlights
- **Yearly Logs** - Set and track yearly goals and achievements
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

## Usage

### Basic Setup

```javascript
import BulletJournal from '@mosioc/bullet-journal';

// Create a new journal instance
const journal = new BulletJournal();

// Or use a custom storage key
const journal = new BulletJournal('my-custom-journal');
```

### Browser (without module system)

```html
<script src="dist/index.min.js"></script>
<script>
  const journal = new BulletJournal();
</script>
```

## API Reference

### Daily Logs

#### Add a Daily Log

```javascript
journal.addDailyLog('2025-11-13', {
  tasks: [
    'Complete project proposal',
    'Review pull requests',
    'Team meeting at 2pm'
  ],
  notes: [
    'Remember to follow up with client',
    'New idea for feature X'
  ],
  events: [
    'Lunch with team',
    'Dentist appointment'
  ]
});
```

#### Get a Daily Log

```javascript
const todayLog = journal.getDailyLog('2025-11-13');
console.log(todayLog);
// {
//   date: '2025-11-13',
//   tasks: [...],
//   notes: [...],
//   events: [...],
//   timestamp: '2025-11-13T10:30:00.000Z'
// }
```

#### Update a Daily Log

```javascript
journal.updateDailyLog('2025-11-13', {
  tasks: [
    'Complete project proposal ✓',
    'Review pull requests',
    'Team meeting at 2pm ✓'
  ]
});
```

#### Delete a Daily Log

```javascript
journal.deleteDailyLog('2025-11-13');
```

#### Get All Daily Logs

```javascript
const allDailyLogs = journal.getAllDailyLogs();
```

### Monthly Logs

#### Add a Monthly Log

```javascript
journal.addMonthlyLog('2025-11', {
  goals: [
    'Launch new feature',
    'Improve code coverage to 80%',
    'Write 4 blog posts'
  ],
  tasks: [
    'Q4 planning',
    'Performance reviews'
  ],
  overview: 'Focus on product launch and team growth',
  highlights: [
    'Successful product demo',
    'Team expansion'
  ]
});
```

#### Get a Monthly Log

```javascript
const novemberLog = journal.getMonthlyLog('2025-11');
```

#### Update a Monthly Log

```javascript
journal.updateMonthlyLog('2025-11', {
  goals: [
    'Launch new feature ✓',
    'Improve code coverage to 80%',
    'Write 4 blog posts'
  ]
});
```

#### Delete a Monthly Log

```javascript
journal.deleteMonthlyLog('2025-11');
```

#### Get All Monthly Logs

```javascript
const allMonthlyLogs = journal.getAllMonthlyLogs();
```

### Yearly Logs

#### Add a Yearly Log

```javascript
journal.addYearlyLog('2025', {
  goals: [
    'Build 3 major products',
    'Grow team to 10 people',
    'Achieve work-life balance'
  ],
  achievements: [],
  overview: 'Year of growth and innovation',
  highlights: []
});
```

#### Get a Yearly Log

```javascript
const yearLog = journal.getYearlyLog('2025');
```

#### Update a Yearly Log

```javascript
journal.updateYearlyLog('2025', {
  achievements: [
    'Launched Product A',
    'Hired 5 new team members'
  ]
});
```

#### Delete a Yearly Log

```javascript
journal.deleteYearlyLog('2025');
```

#### Get All Yearly Logs

```javascript
const allYearlyLogs = journal.getAllYearlyLogs();
```

### Utility Methods

#### Clear All Data

```javascript
journal.clearStorage();
```

#### Export Data

```javascript
const jsonData = journal.exportData();
// Save to file or backup
```

#### Import Data

```javascript
const backupData = '{"dailyLogs":{},"monthlyLogs":{},"yearlyLogs":{}}';
journal.importData(backupData);
```

#### Get Statistics

```javascript
const stats = journal.getStats();
console.log(stats);
// {
//   totalDailyLogs: 30,
//   totalMonthlyLogs: 3,
//   totalYearlyLogs: 1
// }
```

## Data Format

### Date Formats

- **Daily logs**: `YYYY-MM-DD` (e.g., `2025-11-13`)
- **Monthly logs**: `YYYY-MM` (e.g., `2025-11`)
- **Yearly logs**: `YYYY` (e.g., `2025`)

### Storage

Data is automatically saved to `localStorage` with the key `bullet-journal-data` (or your custom key). The data structure:

```json
{
  "dailyLogs": {
    "2025-11-13": {
      "date": "2025-11-13",
      "tasks": [],
      "notes": [],
      "events": [],
      "timestamp": "2025-11-13T10:30:00.000Z"
    }
  },
  "monthlyLogs": {
    "2025-11": {
      "month": "2025-11",
      "goals": [],
      "tasks": [],
      "overview": "",
      "highlights": [],
      "timestamp": "2025-11-01T10:30:00.000Z"
    }
  },
  "yearlyLogs": {
    "2025": {
      "year": "2025",
      "goals": [],
      "achievements": [],
      "overview": "",
      "highlights": [],
      "timestamp": "2025-01-01T10:30:00.000Z"
    }
  }
}
```

## Examples

### Complete Daily Workflow

```javascript
const journal = new BulletJournal();

// Morning: Plan your day
journal.addDailyLog('2025-11-13', {
  tasks: [
    'Morning standup',
    'Code review',
    'Write documentation'
  ],
  notes: ['Focus on high-priority items'],
  events: ['Team lunch at 12pm']
});

// Evening: Update progress
journal.updateDailyLog('2025-11-13', {
  tasks: [
    'Morning standup ✓',
    'Code review ✓',
    'Write documentation (in progress)'
  ]
});
```

### Monthly Planning

```javascript
// Start of month: Set goals
journal.addMonthlyLog('2025-11', {
  goals: [
    'Ship feature X',
    'Reduce bug count by 50%'
  ],
  overview: 'Focus month - quality and delivery'
});

// End of month: Review
journal.updateMonthlyLog('2025-11', {
  highlights: [
    'Feature X launched successfully',
    'Bug count reduced by 60%'
  ]
});
```

### Yearly Review

```javascript
// Year start: Set intentions
journal.addYearlyLog('2025', {
  goals: [
    'Learn a new framework',
    'Contribute to open source',
    'Build side project'
  ]
});

// Year end: Reflect
journal.updateYearlyLog('2025', {
  achievements: [
    'Learned React and Vue',
    'Made 50+ open source contributions',
    'Launched bullet-journal library!'
  ]
});
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 classes
- localStorage API
- JSON methods

