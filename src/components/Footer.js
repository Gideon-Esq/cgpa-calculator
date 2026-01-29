import React from 'react'

function Footer() {
    return (
        <footer className='text-center bg-gray-800 w-full py-4 px-2 text-white text-sm'>
            <p>&copy; {new Date().getFullYear()} BLIS OAU CGPA Calculator. All rights reserved.</p>
        </footer>
    )
}

export default Footer