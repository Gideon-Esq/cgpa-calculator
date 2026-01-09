import React from 'react'
import Course from '../Course/Course'
import './Semester.css'

function Semester(props) {
    const {
        semester,
        id,
        handleGradeChange,
        handleSessionChange
    } = props;

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
                        <option value="" disabled>Select Level</option>
                        <option value="1">100 Level</option>
                        <option value="2">200 Level</option>
                        <option value="3">300 Level</option>
                    </select>

                    <select
                        className="border rounded p-2 text-sm md:text-base w-full md:w-auto bg-white"
                        value={semester.semesterType || ""}
                        onChange={(e) => handleSessionChange(id, semester.level, e.target.value)}
                    >
                        <option value="" disabled>Select Semester</option>
                        <option value="Harmattan">Harmattan</option>
                        <option value="Rain">Rain</option>
                    </select>
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
                        </tr>
                    </thead>
                    <tbody>
                        {semester.courses.length > 0 ? (
                            semester.courses.map((course, index) => {
                                return <Course
                                    key={index}
                                    course={course}
                                    handleGradeChange={(grade) => handleGradeChange(id, index, grade)}
                                    isMobile={false}
                                />
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-500">
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
                            isMobile={true}
                        />
                    })
                ) : (
                    <div className="text-center p-4 text-gray-500 text-sm bg-gray-50 rounded-lg">
                        Please select Level and Semester to load courses.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Semester