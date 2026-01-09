import React from 'react'
import { BsTwitter, BsGithub, BsLinkedin } from 'react-icons/bs'


function Icon({ icon, url }) {
    return (
        <a href={url} className='h-6 w-6'>{icon}</a>
    )
}

function Footer() {
    return (
        <footer className='text-center bg-gray-900 w-full py-3 px-2 text-white text-xs md:text-base'>
            &copy; Hon. Gideon {new Date().getFullYear()} . All rights reserved.
            <div className='flex justify-center gap-3 md:gap-3 mt-2'>
                <Icon icon={<BsTwitter size={18} />} url={'https://twitter.com/olujosh596'} />
                <Icon icon={<BsGithub size={18} />} url={'https://github.com/Josh596'} />
                <Icon icon={<BsLinkedin size={18} />} url={'https://www.linkedin.com/in/joshua-olukotun-a371761b2/'} />
            </div>
        </footer>
    )
}

export default Footer