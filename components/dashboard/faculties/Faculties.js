"use client"
import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Faculties.css';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';

const Faculties = () => {

    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        contact: '',
        email: '',
        image: null
    });
    const [searchTerm, setSearchTerm] = useState('');

    const {
        rows: facultyList,
        allRows,
        allRowsLoading,
        fetchAllRows,
        loading: tableLoading,
        page,
        pageSize,
        setPageSize,
        totalRows,
        totalPages,
        fetchFirstPage,
        fetchLastPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useFirestorePagination({
        collectionName: 'faculties',
        orderDirection: 'asc',
    });
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchableFacultyList = normalizedSearch ? allRows || [] : facultyList;
    const visibleFacultyList = normalizedSearch
        ? searchableFacultyList.filter((faculty) =>
            [
                faculty.name,
                faculty.designation,
                faculty.contact,
                faculty.email,
            ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
          )
        : facultyList;
    React.useEffect(() => {
        if (normalizedSearch) {
            fetchAllRows();
        }
    }, [normalizedSearch, fetchAllRows]);
    const [editingId, setEditingId] = useState(null); // State for tracking the faculty member being edited

    const fetchFacultyList = async () => {
        await fetchFirstPage();
    };

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
                <div className="dashboard-list-toolbar">
                    <h3>Faculty List</h3>
                    <input
                        className="dashboard-list-search"
                        type="search"
                        placeholder="Search faculty..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
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
                        {tableLoading || allRowsLoading ? (
                            <tr>
                                <td colSpan="7" className="dashboard-table-loading-cell">
                                    <div className="dashboard-table-loading">
                                        <i className="pi pi-spin pi-spinner" style={{ color: 'var(--dark-green)', fontSize: '28px' }}></i>
                                    </div>
                                </td>
                            </tr>
                        ) : visibleFacultyList.length > 0 ? (
                        visibleFacultyList.map((faculty, index) => (
                            <tr key={faculty.id}>
                                <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td>
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
                        ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="dashboard-table-empty-cell">
                                    <div className="dashboard-table-empty">No faculty found.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {!normalizedSearch && <TablePaginationFooter
                    totalRows={totalRows}
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onFirstPage={fetchFirstPage}
                    onPreviousPage={fetchPreviousPage}
                    onNextPage={fetchNextPage}
                    onLastPage={fetchLastPage}
                    disabled={tableLoading}
                />}
            </div>
        </div>
    );
};

export default Faculties;
