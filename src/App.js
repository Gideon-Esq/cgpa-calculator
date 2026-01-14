import { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import Graph from './components/Graph';
import Semester from './components/Semester/Semester.js';
import SemesterButton from './components/SemesterButton';
import SemiCircleProgressBar from './components/SemiCircleProgressBar';
import { calculateCGPA } from './utils';
import { courseData } from './data/courses';
import { useAnalytics } from './hooks/useAnalytics';

function App() {

  const [semesters, setSemesters] = useState([])
  const [activeSemesterID, setActiveSemester] = useState(0);

  // Initialize analytics
  const {
    trackSemesterAdded,
    trackSemesterDeleted,
    trackGradeChanged,
    trackSessionChanged,
    trackAnalysisViewed,
    trackCarryOverAdded,
    trackCarryOverRemoved,
    trackCGPACalculated,
    // eslint-disable-next-line no-unused-vars
    trackError,
  } = useAnalytics();

  const localStorageKey = 'results_blis_oau';

  useEffect(() => {
    let results = localStorage.getItem(localStorageKey)
    if (results !== null) {
      try {
        results = JSON.parse(results)
      } catch (e) {
        results = []
      }
    }

    if (!results || results.length === 0) {
      // Initialize with one empty semester
      results = [{ level: '', semesterType: '', courses: [] }]
    }

    setSemesters(results)
  }, [])


  useEffect(() => {
    if (semesters.length > 0) {
        localStorage.setItem(localStorageKey, JSON.stringify(semesters));
    }
  }, [semesters]);


  const addSemester = () => {
    const newSemesters = [...semesters]
    newSemesters.push({ level: '', semesterType: '', courses: [] });
    setSemesters(newSemesters);

    setActiveSemester(newSemesters.length - 1)
    
    // Track analytics
    trackSemesterAdded();
  }


  const checkIfSemesterActive = (semesterIndex) => {
    return (semesterIndex === activeSemesterID)
  }

  const handleSessionChange = (semesterIndex, level, semesterType) => {
    const newSemesters = [...semesters];
    let semester = newSemesters[semesterIndex];

    semester.level = level;
    semester.semesterType = semesterType;

    // Filter courses from data
    if (level && semesterType) {
        const filteredCourses = courseData.filter(c => c.level === level && c.semester === semesterType);

        // Map to course objects with default grade A (5)
        semester.courses = filteredCourses.map(c => ({
            code: c.code,
            title: c.title,
            unit: c.unit,
            grade: 5 // Default grade
        }));
        
        // Track analytics
        trackSessionChanged(level, semesterType);
    } else {
        semester.courses = [];
    }

    setSemesters(newSemesters);
  }

  const handleGradeChange = (semesterIndex, courseIndex, grade) => {
    const newSemesters = [...semesters];
    let semester = newSemesters[semesterIndex];

    semester.courses[courseIndex].grade = parseInt(grade);

    setSemesters(newSemesters)
    
    // Track analytics
    trackGradeChanged(semester.courses[courseIndex].code, grade);
  }

  // Get list of already selected level+semesterType combinations (excluding current semester)
  const getSelectedSemesters = (currentSemesterIndex) => {
    return semesters
      .filter((_, index) => index !== currentSemesterIndex)
      .filter(s => s.level && s.semesterType)
      .map(s => `${s.level}-${s.semesterType}`);
  }

  // Get failed courses from previous semesters that can be retaken
  const getFailedCourses = (currentSemesterIndex) => {
    const currentSemester = semesters[currentSemesterIndex];
    if (!currentSemester || !currentSemester.level || !currentSemester.semesterType) return [];

    const failedCoursesMap = new Map(); // Use Map to deduplicate by course code
    const currentSemesterCodes = currentSemester.courses.map(c => c.code);

    // Build a map of courses that have been passed (retaken successfully) in any semester
    const passedCourses = new Set();
    semesters.forEach((sem) => {
      if (!sem.level || !sem.semesterType) return;
      sem.courses.forEach(course => {
        // If course was passed (grade > 0), add to passed set
        if (course.grade > 0) {
          passedCourses.add(course.code);
        }
      });
    });

    // Look through all previous semesters for failed courses
    semesters.forEach((sem, index) => {
      if (index >= currentSemesterIndex) return; // Only look at previous semesters
      if (!sem.level || !sem.semesterType) return;

      // Only allow carrying forward failed courses from same semester type (Harmattan or Rain)
      if (sem.semesterType !== currentSemester.semesterType) return;

      sem.courses.forEach(course => {
        // Check if course failed (grade 0 = F), not already in current semester, 
        // and hasn't been passed in any other semester
        if (course.grade === 0 && 
            !currentSemesterCodes.includes(course.code) && 
            !passedCourses.has(course.code)) {
          // Only add if not already in map (keeps the first/earliest failure)
          // Or overwrite to keep the most recent failure
          failedCoursesMap.set(course.code, {
            ...course,
            originalLevel: sem.level,
            originalSemester: sem.semesterType
          });
        }
      });
    });

    // Convert map values to array
    return Array.from(failedCoursesMap.values());
  }

  const handleAddFailedCourse = (semesterIndex, failedCourse) => {
    const newSemesters = [...semesters];
    let semester = newSemesters[semesterIndex];

    // Add the failed course with default grade A (so they can change it)
    semester.courses.push({
      code: failedCourse.code,
      title: failedCourse.title,
      unit: failedCourse.unit,
      grade: 5, // Default to A
      isCarryOver: true,
      originalLevel: failedCourse.originalLevel
    });

    setSemesters(newSemesters);
    
    // Track analytics
    trackCarryOverAdded(failedCourse.code);
  }

  const handleRemoveCarryOver = (semesterIndex, courseCode) => {
    const newSemesters = [...semesters];
    let semester = newSemesters[semesterIndex];
    semester.courses = semester.courses.filter(c => !(c.code === courseCode && c.isCarryOver));
    setSemesters(newSemesters);
    
    // Track analytics
    trackCarryOverRemoved(courseCode);
  }

  const handleDeleteSemester = (semesterIndex) => {
    if (semesters.length === 1) {
      // Reset the single semester instead of deleting it
      const newSemesters = [...semesters];
      newSemesters[0] = { level: '', semesterType: '', courses: [] };
      setSemesters(newSemesters);
      return
    }
    const newSemesters = [...semesters];
    newSemesters.splice(semesterIndex, 1)

    if (semesterIndex <= activeSemesterID) {
      setActiveSemester(Math.max(activeSemesterID - 1, 0))
    }
    setSemesters(newSemesters);
    
    // Track analytics
    trackSemesterDeleted();
  }

  const handleViewAnalysis = () => {
    const element = document.getElementById('details-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Track analytics
    trackAnalysisViewed();
  };


  const results = calculateCGPA(semesters);
  
  // Track CGPA calculation whenever it changes
  useEffect(() => {
    if (results.CGPA > 0) {
      trackCGPACalculated(results.CGPA, results.totalUnits);
    }
  }, [results.CGPA, results.totalUnits, trackCGPACalculated]);

  return (
    <>
    <div className='content flex flex-col grow p-2 sm:p-3 md:px-7 gap-1'>
      {/* Header */}
      <div className='mb-2 border-b-4 border-indigo-500 pb-3 md:self-start'>
        <h1 className='text-lg sm:text-xl md:text-2xl font-bold'>BLIS OAU CGPA Calculator</h1>
        <p className='text-xs sm:text-sm text-gray-500'>Department of Educational Technology and Library Studies</p>
      </div>

      {/* Dialup section */}
      <div className='flex flex-col md:flex-row items-center border-b-2 pb-3 gap-3'>
        <div className='w-36 sm:w-44 md:w-52 mx-auto md:ml-auto md:mr-auto'>
          <SemiCircleProgressBar value={results.CGPA} />
        </div>
        <div className='flex flex-col items-center md:items-start'>
          <span className='mb-2 md:mb-4 text-sm md:text-base'>
            <span className='font-medium md:font-normal'>Units Total: {results.totalUnits}</span>
          </span>
          <button className='bg-slate-800 p-2 md:p-3 px-4 rounded text-white text-sm md:text-base' onClick={handleViewAnalysis}>View Analysis</button>
        </div>
      </div>

      {/* Semesters picker */}
      <div className='flex flex-col md:flex-row gap-2 md:gap-0 py-2 md:whitespace-nowrap md:flex-wrap'>
        <div className='flex gap-2 flex-wrap overflow-x-auto pb-2 md:pb-0'>
          {semesters.map((semester, index) => {
            return <SemesterButton key={index} id={index} active={checkIfSemesterActive(index)} onClick={() => setActiveSemester(index)} handleDeleteSemester={() => handleDeleteSemester(index)} />
          })}
        </div>
        <button className='md:ml-auto rounded border p-2 px-3 bg-black text-white text-sm md:text-base whitespace-nowrap' onClick={addSemester}>Add Semester +</button>
      </div>
      {/* Calculator */}
      <div className="flex flex-col bg-white grow p-2 md:p-3 rounded-lg md:rounded-none shadow-sm md:shadow-none">
        {semesters.length > 0 &&
          <Semester
            id={activeSemesterID}
            semester={semesters[activeSemesterID]}
            handleSessionChange={handleSessionChange}
            handleGradeChange={handleGradeChange}
            selectedSemesters={getSelectedSemesters(activeSemesterID)}
            failedCourses={getFailedCourses(activeSemesterID)}
            handleAddFailedCourse={handleAddFailedCourse}
            handleRemoveCarryOver={handleRemoveCarryOver}
           />
        }
        {/* Semester data */}
        {/* Analysis section - Graphs */}
        <div id='details-section' className='mt-4 sm:mt-6 p-2 md:p-0'>
          <h2 className='text-lg md:text-xl font-bold mb-3 text-gray-700 md:hidden'>Performance Analysis</h2>
          <div className='w-full max-w-full overflow-x-auto'>
            <div className='min-w-[280px] md:min-w-0'>
              <Graph semesters={semesters} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>

      </>
  );
}

export default App;
