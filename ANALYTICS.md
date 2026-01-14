# Analytics Module Documentation

## Overview
The CGPA Calculator now includes a comprehensive analytics module that tracks user engagement, usage patterns, and usability metrics. This helps understand:
- **Number of users**: Unique user identification and session tracking
- **Usage frequency**: How often users interact with the calculator
- **Ease of use**: Usability metrics based on engagement patterns

## Features

### 1. **Automatic Tracking**
The analytics system automatically tracks:
- User sessions (total visits)
- CGPA calculations performed
- Semesters created and deleted
- Grade changes
- Feature usage (carry-overs, analysis views, etc.)
- Session duration
- Time to first calculation
- Errors encountered

### 2. **Usability Metrics**
The system calculates a **Usability Score (0-100)** based on:
- Session frequency (30 points)
- Feature usage diversity (30 points)
- Error rate (20 points)
- Time to first calculation (20 points)

Ratings:
- 80-100: Excellent ✅
- 60-79: Good 👍
- 40-59: Fair ⚠️
- 0-39: Needs Improvement ❌

### 3. **Analytics Dashboard**
Access the dashboard by clicking the **"📊 View Analytics"** button (bottom-right corner).

The dashboard shows:
- **Usability Score**: Overall ease-of-use rating
- **Key Metrics**: Sessions, calculations, semesters, grade changes
- **Usage Timeline**: First visit, last visit, user ID
- **Feature Usage**: Visual bars showing which features are most used
- **Usability Insights**: AI-generated insights about user behavior
- **Export**: Download analytics data as JSON

## Setup Instructions

### 1. Install Dependencies
```bash
npm install react-ga4
```

### 2. Configure Google Analytics (Optional)
To enable Google Analytics tracking:

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com/)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Create a `.env` file in the project root:
```bash
cp .env.example .env
```
4. Edit `.env` and add your tracking ID:
```
REACT_APP_GA_TRACKING_ID=G-YOUR-ACTUAL-ID
```

**Note**: The analytics module works WITHOUT Google Analytics - it stores all data locally in the browser's localStorage. Google Analytics is optional for advanced tracking.

### 3. Local Storage
Analytics data is stored in `localStorage` under the key `cgpa_analytics`.

## Usage

### Tracked Events

#### User Actions
- ✅ Add Semester
- ❌ Delete Semester
- ✏️ Change Grade
- 📚 Session Change (level/semester selection)
- 📊 View Analysis
- ➕ Add Carry-Over Course
- ➖ Remove Carry-Over Course
- 🧮 CGPA Calculation

#### Automatic Metrics
- Total sessions
- Session duration
- Time to first calculation
- Feature usage counts
- Error tracking

### Accessing Analytics Data

#### In the App
Click the **"📊 View Analytics"** button to open the dashboard.

#### Programmatically
```javascript
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { getAnalyticsSummary, exportAnalyticsData } = useAnalytics();
  
  // Get summary
  const summary = getAnalyticsSummary();
  console.log(summary);
  
  // Export full data
  const fullData = exportAnalyticsData();
  console.log(fullData);
}
```

#### Exporting Data
1. Open Analytics Dashboard
2. Click **"📥 Export Analytics Data"**
3. Data downloads as JSON file: `cgpa-analytics-YYYY-MM-DD.json`

## Data Structure

### Analytics Summary
```javascript
{
  userId: "user_1234567890_abc123",
  firstVisit: "2026-01-14T10:30:00.000Z",
  lastVisit: "2026-01-14T15:45:00.000Z",
  totalSessions: 5,
  totalCalculations: 12,
  totalSemestersCreated: 8,
  totalGradeChanges: 24,
  mostUsedFeature: "changeGrade",
  averageSessionDuration: 180, // seconds
  timeToFirstCalculation: 45, // seconds
  averageCalculationTime: 30, // seconds
  features: {
    addSemester: 8,
    deleteSemester: 2,
    changeGrade: 24,
    viewAnalysis: 5,
    addCarryOver: 3,
    removeCarryOver: 1
  },
  errorCount: 0
}
```

### Full Export Data
```javascript
{
  userId: "user_1234567890_abc123",
  firstVisit: "2026-01-14T10:30:00.000Z",
  lastVisit: "2026-01-14T15:45:00.000Z",
  totalSessions: 5,
  sessionDurations: [120000, 180000, 150000, 200000, 145000], // milliseconds
  features: { /* ... */ },
  usabilityMetrics: {
    timeToFirstCalculation: 45000, // milliseconds
    averageTimePerCalculation: [30000, 25000, 35000, ...],
    mostUsedFeature: "changeGrade"
  },
  errors: [
    {
      message: "Error message",
      stack: "Error stack trace",
      timestamp: "2026-01-14T12:00:00.000Z"
    }
  ],
  summary: { /* same as analytics summary */ }
}
```

## Privacy & Data Storage

### Local Storage Only
- All analytics data is stored **locally in your browser**
- No data is sent to external servers (unless you configure Google Analytics)
- Data persists across sessions using localStorage
- Clear browser data to reset analytics

### User Privacy
- User ID is randomly generated and anonymous
- No personal information is collected
- No tracking across devices
- GDPR compliant (local storage only)

### Data Retention
- Data stays in browser until:
  - Browser localStorage is cleared
  - User manually resets analytics
  - Browser data is deleted

## Interpreting Metrics

### High Usability Indicators
✅ **High session count**: Users return frequently  
✅ **Low time to first calculation**: Easy to start using  
✅ **High feature diversity**: Exploring multiple features  
✅ **Low error rate**: Smooth experience  
✅ **Consistent session duration**: Engaging experience  

### Low Usability Indicators
⚠️ **Single session only**: User didn't return  
⚠️ **High time to first calculation**: Confusing interface  
⚠️ **Single feature used**: Limited feature discovery  
⚠️ **High error rate**: Technical issues  
⚠️ **Very short sessions**: Not engaging  

## Advanced Usage

### Custom Event Tracking
```javascript
import analytics from './services/analytics';

// Track custom event
analytics.trackEvent('Custom Category', 'custom_action', 'Label', 100);
```

### Error Tracking
```javascript
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { trackError } = useAnalytics();
  
  try {
    // Some code
  } catch (error) {
    trackError(error.message, error.stack);
  }
}
```

### Reset Analytics
```javascript
import analytics from './services/analytics';

// Reset all analytics data
analytics.resetData();
```

## Integration with Google Analytics

### Events Sent to GA4
When configured, the following events are sent to Google Analytics:

| Event Category | Event Action | Description |
|---------------|--------------|-------------|
| Semester | add_semester | User added a semester |
| Semester | delete_semester | User deleted a semester |
| Semester | session_change | User changed level/semester |
| Course | change_grade | User changed a course grade |
| Course | add_carry_over | User added carry-over course |
| Course | remove_carry_over | User removed carry-over |
| Analysis | view_analysis | User viewed performance analysis |
| Calculation | calculate_cgpa | CGPA was calculated |
| Error | error_occurred | An error occurred |

### Custom Dimensions (GA4)
You can set up custom dimensions in GA4 to track:
- User ID (anonymous)
- Session count
- Feature usage patterns
- Usability score

## Troubleshooting

### Analytics Not Tracking
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check if Google Analytics ID is configured (if using GA)

### Dashboard Not Showing Data
1. Use the app to generate some activity
2. Refresh the analytics dashboard
3. Check browser localStorage for `cgpa_analytics` key

### Export Not Working
1. Check browser's download settings
2. Allow pop-ups for the site
3. Ensure localStorage has data

## Future Enhancements

Planned features:
- [ ] A/B testing support
- [ ] Heatmap tracking
- [ ] User journey visualization
- [ ] Cohort analysis
- [ ] Real-time analytics dashboard
- [ ] Server-side analytics API
- [ ] Custom event builder UI
- [ ] Analytics comparison over time

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Export analytics data for debugging
4. Check localStorage data structure

## License

This analytics module is part of the CGPA Calculator project and follows the same license.
