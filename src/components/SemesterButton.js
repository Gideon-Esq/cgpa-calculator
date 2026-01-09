import React from 'react'
import { BsFillTrashFill } from 'react-icons/bs'

function SemesterButton({ onClick, active, id, handleDeleteSemester }) {
  return (
    <div className={`rounded-full border ${active ? "bg-indigo-200" : "border-black"} p-1.5 md:p-2 px-3 md:px-4 flex items-center shadow-sm md:shadow-none transition-all`}>
      <button className='mr-2 md:mr-4 text-xs md:text-base font-medium md:font-normal whitespace-nowrap' type='button' onClick={onClick}>
        <span className='md:hidden'>Sem {id + 1}</span>
        <span className='hidden md:inline'>Semester {id + 1}</span>
      </button>
      <button className='align-middle text-gray-500 md:text-gray-900 hover:text-red-500 transition-colors p-1' type='button' onClick={handleDeleteSemester}>
        <BsFillTrashFill size={12} className='md:w-4 md:h-4' />
      </button>
    </div>
  )
}

export default SemesterButton