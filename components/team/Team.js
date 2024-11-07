import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust the import based on your Firebase configuration
import './Team.css';

const Team = () => {
    // eslint-disable-next-line
    const [faculties, setFaculties] = useState([]);
    const [groupedFaculties, setGroupedFaculties] = useState({
        group1: [],
        group2: [],
        group3: [] 
    });

    useEffect(() => {
        // Function to fetch faculties from Firestore
        const fetchFaculties = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'faculties'));
                const facultyData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFaculties(facultyData);
                groupFaculties(facultyData); // Group faculties after fetching
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            }
        };

        const groupFaculties = (facultyData) => {
            const grouped = {
                group1: [],
                group2: [],
                group3: []
            };

            const group1Names = ['Jabez', 'Praisy Abigail', 'Sivanesh E']; 
            const group2Names = ['Mangaipagan S', 'Praveen P', 'Sneha V', 'Bargavi P', 'Sujaritha N']; 
            const group3Names = ['Ishan', 'Sharmila', 'Santhosh Ravi', 'Roginippriya', 'Thamaraiselvam', 'Manoj']

            facultyData.forEach(member => {
                if (group1Names.includes(member.name)) {
                    grouped.group1.push(member);
                } else if (group2Names.includes(member.name)) {
                    grouped.group2.push(member);
                } else {
                    grouped.group3.push(member); 
                }
            });

            grouped.group2.sort((a, b) => group2Names.indexOf(a.name) - group2Names.indexOf(b.name))

            grouped.group3.sort((a, b) => group3Names.indexOf(a.name) - group3Names.indexOf(b.name))

            setGroupedFaculties(grouped);
        };

        fetchFaculties(); 
    }, []);

    return (
        <div className='team-members'>
            {/* Render Group 1 */}
            {groupedFaculties.group1.length > 0 && (
                <div className="group group1">
                    {groupedFaculties.group1.map((member) => (
                        <div key={member.id} className="members">
                            <img className="member-photo" src={member.image} alt={`${member.name}`} />
                            <h3>{member.name}</h3>
                            <p>{member.designation}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Render Group 2 with Marquee */}
            {groupedFaculties.group2.length > 0 && (
                <div className="group group2">
                        {groupedFaculties.group2.map((member) => (
                            <div key={member.id} className="members">
                                <img className="member-photo" src={member.image} alt={`${member.name}`} />
                                <h3>{member.name}</h3>
                                <p>{member.designation}</p>
                            </div>
                        ))}
                </div>
            )}

            {/* Render Group 3 */}
            {groupedFaculties.group3.length > 0 && (
                <div className="group group3">
                        {groupedFaculties.group3.map((member) => (
                            <div key={member.id} className="members">
                                <img className="member-photo" src={member.image} alt={`${member.name}`} />
                                <h3>{member.name}</h3>
                                <p>{member.designation}</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Team;
