"use client"
import React, { useEffect, useState } from 'react'
import './ReviewCourse.css'
import EditCourse from '../editcourse/EditCourse'
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';

const ReviewCourse = () => {

    const [approvalStatus, setApprovalStatus] = useState({});
    const [approvedCourses, setApprovedCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {
      rows: courses,
      setRows: setCourses,
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
      collectionName: 'courses',
      orderField: 'dateCreated',
    });
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchableCourses = normalizedSearch ? allRows || [] : courses;
    const visibleCourses = normalizedSearch
      ? searchableCourses.filter((course) =>
          [
            formatDate(course.dateCreated),
            course.courseTitle,
            course.mode,
            course.audience?.join(', '),
            course.priceDetail,
            course.price,
          ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
        )
      : courses;

    useEffect(() => {
      if (normalizedSearch) {
        fetchAllRows();
      }
    }, [normalizedSearch, fetchAllRows]);

    useEffect(() => {
      const initialApprovalStatus = {};
      const approvedList = [];

      courses.forEach((course) => {
        initialApprovalStatus[course.id] = course.approved === 'yes';
        if (initialApprovalStatus[course.id]) {
          approvedList.push(course);
        }
      });

      setApprovalStatus(initialApprovalStatus);
      setApprovedCourses(approvedList);
    }, [courses]);

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
    

    function formatDate(date) {
        if (!date) {
          return 'N/A';
        }
    
        if (typeof date === 'object' && date.seconds) {
          const timestamp = new Date(date.seconds * 1000);
          return formatDateString(timestamp);
        }
    
        const parsedDate = new Date(date);
        return formatDateString(parsedDate);
      }
    

    function formatDateString(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }

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
    
      
  return (
    <div className="review-course-container">
      <div className="dashboard-list-toolbar">
        <h1>Review Course</h1>
        <input
          className="dashboard-list-search"
          type="search"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {(courses.length > 0 || tableLoading || allRowsLoading) ? (
        <>
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
              {tableLoading || allRowsLoading ? (
                <tr>
                  <td colSpan="12" className="dashboard-table-loading-cell">
                    <div className="dashboard-table-loading">
                      <GridLoader color={"#0A4044"} loading={tableLoading} size={10} />
                    </div>
                  </td>
                </tr>
              ) : visibleCourses.length > 0 ? (
              visibleCourses.map((course, index) => (
                <tr key={course.id}>
                  <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td>
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
              ))
              ) : (
                <tr>
                  <td colSpan="12" className="dashboard-table-empty-cell">
                    <div className="dashboard-table-empty">No courses found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        </>
      ) : (
        <div></div>
      )}


    </div>
  )
}

export default ReviewCourse
