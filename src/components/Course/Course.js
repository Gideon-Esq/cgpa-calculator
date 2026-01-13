import React from 'react'
import './Course.css'

function Course({ course, handleGradeChange, handleRemoveCarryOver, isMobile }) {
    // Mobile Card View
    if (isMobile) {
        return (
            <div className={`rounded-lg p-3 border shadow-sm ${course?.isCarryOver ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm block ${course?.isCarryOver ? 'text-orange-700' : 'text-indigo-700'}`}>{course?.code}</span>
                            {course?.isCarryOver && (
                                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                                    Carry-Over (Part {course.originalLevel})
                                </span>
                            )}
                        </div>
                        <span className="text-gray-700 text-sm leading-tight block mt-1">{course?.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${course?.isCarryOver ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {course?.unit} Unit{course?.unit > 1 ? 's' : ''}
                        </span>
                        {handleRemoveCarryOver && (
                            <button
                                className="text-red-500 hover:text-red-700 text-lg font-bold leading-none"
                                onClick={handleRemoveCarryOver}
                                title="Remove carry-over course"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-sm font-medium">Grade:</span>
                    <select 
                        className='w-20 text-center border rounded-lg p-2 bg-white text-sm font-medium shadow-sm' 
                        value={course?.grade} 
                        onChange={(e) => handleGradeChange(e.target.value)}
                    >
                        <option value={5}>A</option>
                        <option value={4}>B</option>
                        <option value={3}>C</option>
                        <option value={2}>D</option>
                        <option value={1}>E</option>
                        <option value={0}>F</option>
                    </select>
                </div>
            </div>
        )
    }

    // Desktop Table Row View
    return (
        <tr className={`border-b ${course?.isCarryOver ? 'bg-orange-50' : ''}`}>
            {/* Course Code */}
            <td className='pr-3 py-2 font-semibold text-gray-700'>
                <div className="flex items-center gap-2">
                    <span className={course?.isCarryOver ? 'text-orange-700' : ''}>{course?.code}</span>
                    {course?.isCarryOver && (
                        <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                            Carry-Over (Part {course.originalLevel})
                        </span>
                    )}
                </div>
            </td>
            {/* Course Title */}
            <td className='pr-3 py-2 text-left text-gray-800'>{course?.title}</td>
            {/* Grade, dropdown */}
            <td className='pr-3 py-2'>
                <select 
                    className='w-16 text-center border rounded p-1 bg-white' 
                    value={course?.grade} 
                    onChange={(e) => handleGradeChange(e.target.value)}
                >
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
            {/* Remove button for carry-over courses */}
            <td className='text-center py-2'>
                {handleRemoveCarryOver && (
                    <button
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                        onClick={handleRemoveCarryOver}
                        title="Remove carry-over course"
                    >
                        ×
                    </button>
                )}
            </td>
        </tr>
    )
}

export default Course