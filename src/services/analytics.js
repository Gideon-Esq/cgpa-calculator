import ReactGA from 'react-ga4';

/**
 * Google Analytics Service for CGPA Calculator
 * Tracks user engagement, usage patterns, and app interactions
 */

const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

class AnalyticsService {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    if (!GA_TRACKING_ID) {
      console.warn('Google Analytics not configured. Set REACT_APP_GA_TRACKING_ID in .env');
      return;
    }

    try {
      ReactGA.initialize(GA_TRACKING_ID, {
        gaOptions: { anonymizeIp: true },
      });
      this.initialized = true;
      console.log('Google Analytics initialized');
      this.trackPageView(window.location.pathname);
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  trackPageView(path) {
    if (!this.initialized) return;
    ReactGA.send({ hitType: 'pageview', page: path });
  }

  trackEvent(category, action, label = null, value = null) {
    if (!this.initialized) return;

    const eventParams = { category, action };
    if (label) eventParams.label = label;
    if (value !== null) eventParams.value = value;

    ReactGA.event(eventParams);
  }

  trackSemesterAdded() {
    this.trackEvent('Semester', 'add_semester', 'Added new semester');
  }

  trackSemesterDeleted() {
    this.trackEvent('Semester', 'delete_semester', 'Deleted semester');
  }

  trackGradeChanged(courseCode, newGrade) {
    this.trackEvent('Course', 'change_grade', courseCode, newGrade);
  }

  trackSessionChanged(level, semesterType) {
    this.trackEvent('Semester', 'session_change', `${level} - ${semesterType}`);
  }

  trackAnalysisViewed() {
    this.trackEvent('Analysis', 'view_analysis', 'Viewed performance analysis');
  }

  trackCarryOverAdded(courseCode) {
    this.trackEvent('Course', 'add_carry_over', courseCode);
  }

  trackCarryOverRemoved(courseCode) {
    this.trackEvent('Course', 'remove_carry_over', courseCode);
  }

  trackCGPACalculated(cgpa, totalUnits) {
    this.trackEvent('Calculation', 'calculate_cgpa', `CGPA: ${cgpa.toFixed(2)}`, totalUnits);
  }

  trackError(errorMessage) {
    this.trackEvent('Error', 'error_occurred', errorMessage);
  }
}

const analytics = new AnalyticsService();

export default analytics;
