'use client';
import React, { useState, useEffect } from 'react';
import './CareersLayout.css';
import { db } from '../../lib/firebase'; // Ensure you have Firebase configured and exported in firebase.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';

const CareersLayout = ({ children }) => {
    const [loading, setLoading] = useState(false);   
    const [jobAreas, setJobAreas] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filters, setFilters] = useState({
        jobArea: '',
        jobType: '',
        experience: '',
        country: '',
        city: '',
    });
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const jobsRef = collection(db, 'jobs'); 
            const approvedJobsQuery = query(jobsRef, where("approved", "==", true));
            const jobSnapshot = await getDocs(approvedJobsQuery);
            const jobList = jobSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));

            jobList.sort((a, b) => {
                const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate(); 
                const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate(); 
                return dateB - dateA; // Sort in descending order
              });

            setAllJobs(jobList);
            setFilteredJobs(jobList);

            const areas = [...new Set(jobList.map(job => job.jobArea))];
            const types = [...new Set(jobList.map(job => job.jobType))];
            const experiences = [...new Set(jobList.map(job => job.experience))];
            const countries = [...new Set(jobList.map(job => job.country))];
            const cities = [...new Set(jobList.map(job => job.city))];

            setJobAreas(areas);
            setJobTypes(types);
            setExperiences(experiences);
            setCountries(countries);
            setCities(cities);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = allJobs;

        if (filters.jobArea) {
            filtered = filtered.filter(job => job.jobArea === filters.jobArea);
        }
        if (filters.jobType) {
            filtered = filtered.filter(job => job.jobType === filters.jobType);
        }
        if (filters.experience) {
            filtered = filtered.filter(job => job.experience === filters.experience);
        }
        if (filters.country) {
            filtered = filtered.filter(job => job.country === filters.country);
        }
        if (filters.city) {
            filtered = filtered.filter(job => job.city === filters.city);
        }

        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    }, [filters, allJobs, searchQuery]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    return (
        <div className="careers-container">
            <div className="career-header">
                <div className="career-header-content">
                    <h1>Careers</h1>
                    <h2>Be Part of the Frontline in Emergency Care – Shaping Lifesaving Careers for Dedicated Paramedics</h2>
                </div>
                <div className="career-header-image">
                    <img
                        src="/assets/careers/header.jpg"
                        alt="career-header"
                        style={{ objectFit: "cover", width: "100%", height: "auto" }}
                    />
                </div>
            </div>

            <div className="career-main">
                <div className="career-search-bar">
                    <input
                        type="text"
                        placeholder="Search jobs by keywords"
                        className="search-input"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="select-jobs">
                        <select name="jobArea" onChange={handleFilterChange} className="select-input">
                            <option value="">All Jobs</option>
                            {jobAreas.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>

                        <select name="jobType" onChange={handleFilterChange} className="select-input">
                            <option value="">Job Type</option>
                            {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>

                        <select name="experience" onChange={handleFilterChange} className="select-input">
                            <option value="">Experience</option>
                            {experiences.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                        </select>

                        <select name="country" onChange={handleFilterChange} className="select-input">
                            <option value="">Country</option>
                            {countries.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>

                        <select name="city" onChange={handleFilterChange} className="select-input">
                            <option value="">City</option>
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <GridLoader color="#0A4044" loading={loading} size={10} />
                </div>
            ) : (
                React.Children.map(children, child =>
                    React.cloneElement(child, { filteredJobs })
                )
            )}
        </div>
    );
};

export default CareersLayout;
