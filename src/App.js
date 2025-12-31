import { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import Graph from './components/Graph';
import Semester from './components/Semester/Semester.js';
import SemesterButton from './components/SemesterButton';
import SemiCircleProgressBar from './components/SemiCircleProgressBar';
import { calculateCGPA } from './utils';
import { courseData } from './data/courses';

function App() {

  const [semesters, setSemesters] = useState([])
  const [activeSemesterID, setActiveSemester] = useState(0);

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
  }

  const handleViewAnalysis = () => {
    const element = document.getElementById('details-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const results = calculateCGPA(semesters);

  return (
    <>
    <div className='content flex flex-col grow p-3 px-7 gap-1'>
      {/* Header */}
      <div className='mb-2 border-b-4 border-indigo-500 self-start pb-3'>
        <h1 className='text-2xl font-bold'>BLIS OAU CGPA Calculator</h1>
        <p className='text-sm text-gray-500'>Department of Educational Technology and Library Studies</p>
      </div>

      {/* Dialup section */}
      <div className='flex border-b-2  pb-3'>
        <div className='w-52  ml-auto mr-auto'>
          <SemiCircleProgressBar value={results.CGPA} />

        </div>
        <div className='flex flex-col'>
          <span className='mb-4'> <span>Units Total: {results.totalUnits}</span> </span>

          <button className='bg-slate-800 p-3 rounded text-white' onClick={handleViewAnalysis}>View Analysis</button>
        </div>
      </div>

      {/* Semesters picker */}
      <div className='flex whitespace-nowrap flex-wrap'>
        <div className='flex gap-2 flex-wrap'>
          {semesters.map((semester, index) => {
            return <SemesterButton key={index} id={index} active={checkIfSemesterActive(index)} onClick={() => setActiveSemester(index)} handleDeleteSemester={() => handleDeleteSemester(index)} />
          })}
        </div>
        <button className='ml-auto rounded border p-2 bg-black text-white' onClick={addSemester}>Add Semester + </button>
      </div>
      {/* Calculator */}
      <div className="flex flex-col bg-white grow p-3">
        {semesters.length > 0 &&
          <Semester
            id={activeSemesterID}
            semester={semesters[activeSemesterID]}
            handleSessionChange={handleSessionChange}
            handleGradeChange={handleGradeChange}
           />
        }
        {/* Semester data */}
        {/* Analysis section - Graphs */}
        <div id='details-section' className=''>
          <Graph semesters={semesters} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>

      </>
  );
}

export default App;
