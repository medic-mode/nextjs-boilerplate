"use client"
import React, { useEffect, useState } from 'react'
import './ReviewCourse.css'
import EditCourse from '../editcourse/EditCourse'
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const ReviewCourse = () => {

  const {loading, setLoading} = useAuth();

    const [courses, setCourses] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState({});
    const [approvedCourses, setApprovedCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'courses'));
            const courses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


            courses.sort((a, b) => {
              const dateA = new Date(a.dateCreated); // Convert to Date object
              const dateB = new Date(b.dateCreated); // Convert to Date object
              return dateB - dateA; // Descending order
            });

            // Initialize approval status and approved posts
            const initialApprovalStatus = {};
            const approvedList = []; // Temporary array to hold approved posts
    
            courses.forEach((course) => {
              initialApprovalStatus[course.id] = course.approved === 'yes'; // Check Firestore approval status
              if (initialApprovalStatus[course.id]) {
                approvedList.push(course); // Add to approved list if already approved
              }
            });

            setCourses(courses);
            setApprovalStatus(initialApprovalStatus);
            setApprovedCourses(approvedList);
          } catch (error) {
            console.error('Error fetching courses: ', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCourses();
        // eslint-disable-next-line
      }, []);

    const handleApprovalChange = async (courseId) => {
        const isApproved = approvalStatus[courseId];
        const newApprovalStatus = !isApproved;
    
        setApprovalStatus((prevState) => ({
          ...prevState,
          [courseId]: newApprovalStatus,
        }));
    
        const approvedCourse = courses.find((course) => course.id === courseId);
        if (approvedCourse) {
          // Update approved posts state
          if (newApprovalStatus && !approvedCourses.includes(approvedCourse)) {
            setApprovedCourses((prevApproved) => [...prevApproved, approvedCourse]);
          } else if (!newApprovalStatus) {
            setApprovedCourses((prevApproved) => prevApproved.filter((course) => course.id !== courseId));
          }
    
          try {
            await updateDoc(doc(db, 'courses', courseId), {
              approved: newApprovalStatus ? 'yes' : 'no',
            });
          } catch (error) {
            console.error('Error updating course approval status: ', error);
          }
        }
      };
    

    const formatDate = (date) => {
        if (!date) {
          return 'N/A';
        }
    
        if (typeof date === 'object' && date.seconds) {
          const timestamp = new Date(date.seconds * 1000);
          return formatDateString(timestamp);
        }
    
        const parsedDate = new Date(date);
        return formatDateString(parsedDate);
      };
    

    const formatDateString = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const handleDelete = async (courseId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    
        if (confirmDelete) {
          try {
            await deleteDoc(doc(db, 'courses', courseId));
            setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
          } catch (error) {
            console.error('Error deleting course: ', error);
          }
        }
      };
    
      
if (loading) {
  return (
    <div className="loading-container">
      <GridLoader color={"#0A4044"} loading={loading} size={10} />
    </div>
  );
}

      
  return (
    <div className="review-course-container">
      <h1>Review Course</h1>
      {courses.length > 0 ? (
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date Created</th>
                <th>Course Title</th>
                <th>Mode</th>
                <th>Audience</th>
                <th colSpan="2">Price Details</th>
                <th colSpan="2">Description</th>
                <th>Thumbnail</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(course.dateCreated)}</td>
                  <td>{course.courseTitle}</td>
                  <td>{course.mode}</td>
                  <td>{course.audience.join(', ')}</td>
                  <td>{course.priceDetail}</td>
                  <td>{course.priceDetail === 'Free' || course.priceDetail === 'Contact Us' ? '-' : `Rs. ${course.price}`}</td>
                  <td>
                    <Link href={`/courses/${course.id}`} >
                      View course
                    </Link>
                  </td>
                  <td>
                  <Link
                      href={{
                        pathname: "/dashboard/review-course/edit-course",
                        query: {
                          id: course.id
                        },
                      }}
                    >
                      Edit Course
                    </Link>

                  </td>
                  <td>
                    {course.thumbnail ? (
                      <Link href={course.thumbnail} >
                        View Thumbnail
                      </Link>
                    ) : (
                      <>No Image</>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => handleApprovalChange(course.id)}
                      className={`approve-btn ${approvalStatus[course.id] ? 'approved' : 'pending'}`}
                    >
                      {approvalStatus[course.id] ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(course.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}


    </div>
  )
}

export default ReviewCourse