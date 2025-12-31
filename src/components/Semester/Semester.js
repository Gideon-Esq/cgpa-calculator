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
            <div className='flex flex-col md:flex-row pb-4 gap-4 items-start md:items-center'>
                <span className='font-bold text-xl' style={{ color: 'rgb(3,4,94)' }}>Semester {id + 1}</span>

                <div className="flex gap-2">
                    <select
                        className="border rounded p-2"
                        value={semester.level || ""}
                        onChange={(e) => handleSessionChange(id, e.target.value, semester.semesterType)}
                    >
                        <option value="" disabled>Select Level</option>
                        <option value="1">100 Level</option>
                        <option value="2">200 Level</option>
                        <option value="3">300 Level</option>
                    </select>

                    <select
                        className="border rounded p-2"
                        value={semester.semesterType || ""}
                        onChange={(e) => handleSessionChange(id, semester.level, e.target.value)}
                    >
                        <option value="" disabled>Select Semester</option>
                        <option value="Harmattan">Harmattan</option>
                        <option value="Rain">Rain</option>
                    </select>
                </div>

                <span className='font-bold ml-auto'>Semester GPA: {calculateGPA(semester.courses)}</span>
            </div>

            {/* Courses table */}
            <div className="overflow-x-auto">
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
        </div>
    )
}

export default Semester