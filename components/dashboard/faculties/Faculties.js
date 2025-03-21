"use client"
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Faculties.css';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';

const Faculties = () => {

    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        contact: '',
        email: '',
        image: null
    });

    const [facultyList, setFacultyList] = useState([]);
    const [editingId, setEditingId] = useState(null); // State for tracking the faculty member being edited

    const fetchFacultyList = async () => {
        const querySnapshot = await getDocs(collection(db, 'faculties'));
        const facultyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFacultyList(facultyData);
    };

    useEffect(() => {
        fetchFacultyList();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0]
        }));
    };

    const handleUpload = async () => {
        setSubmitted(true)
        try {
            const { name, designation, contact, email, image } = formData;

            if (!name || !designation || !image) {
                alert('Please fill in all fields and select an image');
                return;
            }

            const storage = getStorage();
            const storageRef = ref(storage, `faculties/${image.name}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);

            // If editing, update the existing document
            if (editingId) {
                await updateDoc(doc(db, 'faculties', editingId), {
                    name,
                    designation,
                    contact,
                    email,
                    image: imageUrl
                });
                alert('Faculty member updated successfully!');
            } else {
                // Otherwise, add a new faculty member
                await addDoc(collection(db, 'faculties'), {
                    name,
                    designation,
                    contact,
                    email,
                    image: imageUrl
                });
                alert('Faculty member added successfully!');
            }

            // Reset form and refresh list
            setFormData({
                name: '',
                designation: '',
                contact: '',
                email: '',
                image: null
            });
            setEditingId(null); // Clear editing ID
            fetchFacultyList(); // Refresh faculty list
        } catch (error) {
            console.error('Error adding/updating document: ', error);
            alert('Error adding/updating faculty member');
        }finally {
            setSubmitted(false); 
          }
    };

    const handleEdit = (faculty) => {
        setFormData({
            name: faculty.name,
            designation: faculty.designation,
            contact: faculty.contact,
            email: faculty.email,
            image: null // We won't pre-fill the image field
        });
        setEditingId(faculty.id); // Set the ID of the faculty member being edited
    };

    return (
        <div className='faculty-container'>
            <h2>{editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}</h2>
            <div className="faculty-inputs">
                <div className='faculty-item'>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='faculty-item'>
                    <label>Designation</label>
                    <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='faculty-item'>
                    <label>Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                    />
                </div>
                <div className='faculty-item'>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='faculty-item image-input'>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={!editingId} // Require image only when adding a new member
                    />
                </div>
                <div className='faculty-item'>
                <Button 
                    className="faculty-btn" 
                    type="submit" 
                    label={submitted ? <i className="pi pi-spin pi-spinner"></i> : (editingId ? 'Update' : 'Upload')} 
                    disabled={submitted} 
                    onClick={handleUpload}
                    />
                </div>
            </div>

            <hr style={{ border: '1px solid var(--dark-green)', margin: '20px 0' }} />

            <div className="faculty-list">
                <h3>Faculty List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>S. No</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyList.map((faculty, index) => (
                            <tr key={faculty.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={faculty.image} alt={faculty.name} style={{ width: '50px', height: '60px' }} />
                                </td>
                                <td>{faculty.name}</td>
                                <td>{faculty.designation}</td>
                                <td>{faculty.contact}</td>
                                <td>{faculty.email}</td>
                                <td>
                                    <button className='faculty-btn' style={{margin:'0'}} onClick={() => handleEdit(faculty)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Faculties;
