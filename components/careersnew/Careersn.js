"use client"
import Image from 'next/image'
import './Careersn.css'

const Careers = () => {

  

  return (
    <div className='careers-container'>
        <div className="career-header">
            <div className="career-header-content">
                <h1>Careers</h1>
                <p>Be Part of the Frontline in Emergency Care – Shaping Lifesaving Careers for Dedicated Paramedics</p>
            </div>
            <div className="career-header-image">
                <Image
                src='/assets/careers/header.jpg'  
                alt="career-header-image"
                width={500}
                height={500}
                objectFit="cover"
            />
            </div>
        </div>
        <div className="career-main">
        <div className="career-search-bar">
            <div className="search-jobs">
            <input type="text" placeholder="Search jobs by keywords" className="search-input" />
            </div>
            <div className="select-jobs">
            <select name="category" className="select-input">
                <option value="">All Jobs</option>
                <option value="paramedic">Paramedic</option>
                <option value="admin">Admin</option>
                <option value="nurse">Nurse</option>
                <option value="office">Office</option>
            </select>

            <select name="jobType" className="select-input">
                <option value="">Job Type</option>
                <option value="part-time">Part Time</option>
                <option value="full-time">Full Time</option>
                <option value="freelance">Freelance</option>
            </select>

            <select name="experience" className="select-input">
                <option value="">Experience</option>
                <option value="fresher">Fresher</option>
                <option value="1-3">1-3 Years</option>
                <option value="4-6">4-6 Years</option>
                <option value="7+">7+ Years</option>
            </select>

            <select name="country" className="select-input">
                <option value="">Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
            </select>

            <select name="city" className="select-input">
                <option value="">City</option>
                <option value="new-york">New York</option>
                <option value="los-angeles">Los Angeles</option>
                <option value="london">London</option>
                <option value="manchester">Manchester</option>
                <option value="birmingham">Birmingham</option>
            </select>
            </div>
        </div>
        </div>
    </div>

  )
}

export default Careers