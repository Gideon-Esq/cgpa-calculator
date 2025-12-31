import React from 'react'
import './Course.css'

function Course({ course, handleGradeChange }) {
    return (
        <tr className="border-b">
            {/* Course Code */}
            <td className='pr-3 py-2 font-semibold text-gray-700'>{course?.code}</td>
            {/* Course Title */}
            <td className='pr-3 py-2 text-left text-gray-800'>{course?.title}</td>
            {/* Grade, dropdown */}
            <td className='pr-3 py-2'>
                <select className='w-16 text-center border rounded p-1 bg-white' value={course?.grade} onChange={(e) => handleGradeChange(e.target.value)}>
                    <option value={5}>A</option>
                    <option value={4}>B</option>
                    <option value={3}>C</option>
                    <option value={2}>D</option>
                    <option value={1}>E</option>
                    <option value={0}>F</option>
                </select>
            </td>
            {/* Unit */}
            <td className='text-center py-2'>{course?.unit}</td>
        </tr>
    )
}

export default Course