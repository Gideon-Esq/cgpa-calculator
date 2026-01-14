import { useEffect, useCallback } from 'react';
import analytics from '../services/analytics';

/**
 * Custom hook for Google Analytics tracking
 */
export const useAnalytics = () => {
  useEffect(() => {
    analytics.initialize();
  }, []);

  const trackSemesterAdded = useCallback(() => {
    analytics.trackSemesterAdded();
  }, []);

  const trackSemesterDeleted = useCallback(() => {
    analytics.trackSemesterDeleted();
  }, []);

  const trackGradeChanged = useCallback((courseCode, newGrade) => {
    analytics.trackGradeChanged(courseCode, newGrade);
  }, []);

  const trackSessionChanged = useCallback((level, semesterType) => {
    analytics.trackSessionChanged(level, semesterType);
  }, []);

  const trackAnalysisViewed = useCallback(() => {
    analytics.trackAnalysisViewed();
  }, []);

  const trackCarryOverAdded = useCallback((courseCode) => {
    analytics.trackCarryOverAdded(courseCode);
  }, []);

  const trackCarryOverRemoved = useCallback((courseCode) => {
    analytics.trackCarryOverRemoved(courseCode);
  }, []);

  const trackCGPACalculated = useCallback((cgpa, totalUnits) => {
    analytics.trackCGPACalculated(cgpa, totalUnits);
  }, []);

  const trackError = useCallback((errorMessage) => {
    analytics.trackError(errorMessage);
  }, []);

  return {
    trackSemesterAdded,
    trackSemesterDeleted,
    trackGradeChanged,
    trackSessionChanged,
    trackAnalysisViewed,
    trackCarryOverAdded,
    trackCarryOverRemoved,
    trackCGPACalculated,
    trackError,
  };
};
