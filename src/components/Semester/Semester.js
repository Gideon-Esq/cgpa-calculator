import React, { useState } from 'react'
import Course from '../Course/Course'
import './Semester.css'

function Semester(props) {
    const {
        semester,
        id,
        handleGradeChange,
        handleSessionChange,
        selectedSemesters = [],
        failedCourses = [],
        handleAddFailedCourse,
        handleRemoveCarryOver
    } = props;

    const [showFailedModal, setShowFailedModal] = useState(false);

    // Guard against undefined semester
    if (!semester) {
        return (
            <div className="text-center p-4 text-gray-500">
                Loading semester data...
            </div>
        );
    }

    // Check if a semester combination is already selected
    const isSemesterSelected = (level, semesterType) => {
        return selectedSemesters.includes(`${level}-${semesterType}`);
    };

    const calculateGPA = (courses) => {
        let totalUnits = 0;
        let totalGradePoints = 0;

        courses.forEach((course) => {
            totalUnits += parseInt(course.unit);
            totalGradePoints += parseInt(course.unit) * parseInt(course.grade);
        });

        let gpa = (totalGradePoints / totalUnits).toFixed(2)
        
        return isNaN(gpa) ? 0 : gpa;
    };

    return (
        <div className='flex flex-col'>
            {/* Header with Selectors */}
            <div className='flex flex-col md:flex-row gap-3 pb-4 md:gap-4 md:items-start md:items-center'>
                <div className='flex flex-col md:hidden gap-2'>
                    <span className='font-bold text-lg' style={{ color: 'rgb(3,4,94)' }}>Semester {id + 1}</span>
                    <span className='font-bold text-base bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full w-fit'>
                        GPA: {calculateGPA(semester.courses)}
                    </span>
                </div>
                
                <span className='hidden md:block font-bold text-xl' style={{ color: 'rgb(3,4,94)' }}>Semester {id + 1}</span>

                <div className="flex flex-col md:flex-row gap-2">
                    <select
                        className="border rounded p-2 text-sm md:text-base w-full md:w-auto bg-white"
                        value={semester.level || ""}
                        onChange={(e) => handleSessionChange(id, e.target.value, semester.semesterType)}
                    >
                        <option value="" disabled>Select Part</option>
                        <option value="1" disabled={semester.semesterType && isSemesterSelected('1', semester.semesterType)}>
                            Part 1 {semester.semesterType && isSemesterSelected('1', semester.semesterType) ? '(Already selected)' : ''}
                        </option>
                        <option value="2" disabled={semester.semesterType && isSemesterSelected('2', semester.semesterType)}>
                            Part 2 {semester.semesterType && isSemesterSelected('2', semester.semesterType) ? '(Already selected)' : ''}
                        </option>
                        <option value="3" disabled={semester.semesterType && isSemesterSelected('3', semester.semesterType)}>
                            Part 3 {semester.semesterType && isSemesterSelected('3', semester.semesterType) ? '(Already selected)' : ''}
                        </option>
                        <option value="4" disabled={semester.semesterType && isSemesterSelected('4', semester.semesterType)}>
                            Part 4 {semester.semesterType && isSemesterSelected('4', semester.semesterType) ? '(Already selected)' : ''}
                        </option>
                    </select>

                    <select
                        className="border rounded p-2 text-sm md:text-base w-full md:w-auto bg-white"
                        value={semester.semesterType || ""}
                        onChange={(e) => handleSessionChange(id, semester.level, e.target.value)}
                    >
                        <option value="" disabled>Select Semester</option>
                        <option value="Harmattan" disabled={semester.level && isSemesterSelected(semester.level, 'Harmattan')}>
                            Harmattan {semester.level && isSemesterSelected(semester.level, 'Harmattan') ? '(Already selected)' : ''}
                        </option>
                        <option value="Rain" disabled={semester.level && isSemesterSelected(semester.level, 'Rain')}>
                            Rain {semester.level && isSemesterSelected(semester.level, 'Rain') ? '(Already selected)' : ''}
                        </option>
                    </select>

                    {/* Button to add failed courses */}
                    {failedCourses.length > 0 && (
                        <button
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base px-3 py-2 rounded font-medium transition-colors"
                            onClick={() => setShowFailedModal(true)}
                        >
                            Add Carry-Over ({failedCourses.length})
                        </button>
                    )}
                </div>
                
                <span className='hidden md:block font-bold md:ml-auto'>Semester GPA: {calculateGPA(semester.courses)}</span>
            </div>

            {/* Courses - Table on desktop, Cards on mobile */}
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className='table-auto w-full mx-auto'>
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Code</th>
                            <th className="p-2">Title</th>
                            <th className="p-2">Grade</th>
                            <th className="p-2">Unit</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {semester.courses.length > 0 ? (
                            semester.courses.map((course, index) => {
                                return <Course
                                    key={index}
                                    course={course}
                                    handleGradeChange={(grade) => handleGradeChange(id, index, grade)}
                                    handleRemoveCarryOver={course.isCarryOver ? () => handleRemoveCarryOver(id, course.code) : null}
                                    isMobile={false}
                                />
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    Please select Level and Semester to load courses.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-2">
                {semester.courses.length > 0 ? (
                    semester.courses.map((course, index) => {
                        return <Course
                            key={index}
                            course={course}
                            handleGradeChange={(grade) => handleGradeChange(id, index, grade)}
                            handleRemoveCarryOver={course.isCarryOver ? () => handleRemoveCarryOver(id, course.code) : null}
                            isMobile={true}
                        />
                    })
                ) : (
                    <div className="text-center p-4 text-gray-500 text-sm bg-gray-50 rounded-lg">
                        Please select Level and Semester to load courses.
                    </div>
                )}
            </div>

            {/* Failed Courses Modal */}
            {showFailedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Add Carry-Over Courses</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                onClick={() => setShowFailedModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Select failed courses from previous semesters to retake:
                        </p>
                        <div className="flex flex-col gap-2">
                            {failedCourses.map((course, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex-1">
                                        <span className="font-bold text-orange-700 text-sm">{course.code}</span>
                                        <span className="text-gray-600 text-xs ml-2">(Part {course.originalLevel})</span>
                                        <p className="text-gray-700 text-sm mt-1">{course.title}</p>
                                        <span className="text-xs text-gray-500">{course.unit} Unit(s)</span>
                                    </div>
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded font-medium transition-colors ml-2"
                                        onClick={() => {
                                            handleAddFailedCourse(id, course);
                                            setShowFailedModal(false);
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-medium transition-colors"
                            onClick={() => setShowFailedModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Semester