"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Import Firestore configuration
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './ReviewEvent.css';
import Link from 'next/link';
import { GridLoader } from 'react-spinners';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';

const ReviewEvent = () => {

  
  const [approvalStatus, setApprovalStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const {
    rows: events,
    setRows: setEvents,
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
    collectionName: 'events',
    orderField: 'date',
  });
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchableEvents = normalizedSearch ? allRows || [] : events;
  const visibleEvents = normalizedSearch
    ? searchableEvents.filter((event) =>
        [
          formatDate(event.date),
          event.title,
          event.location,
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      )
    : events;

  useEffect(() => {
    if (normalizedSearch) {
      fetchAllRows();
    }
  }, [normalizedSearch, fetchAllRows]);

  useEffect(() => {
    const initialApproval = {};
    events.forEach((event) => {
      initialApproval[event.id] = event.approved || false;
    });
    setApprovalStatus(initialApproval);
  }, [events]);

  // Handle Approval Toggle
  const handleApprovalChange = async (eventId) => {
    const updatedStatus = !approvalStatus[eventId];
    setApprovalStatus({ ...approvalStatus, [eventId]: updatedStatus });

    const eventDoc = doc(db, 'events', eventId);
    await updateDoc(eventDoc, { approved: updatedStatus });
  };

  // Handle Delete Event
  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteDoc(doc(db, 'events', eventId));
      setEvents(events.filter((event) => event.id !== eventId));
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

  return (
    <div className="review-event-container">
      <div className="dashboard-list-toolbar">
        <h1>Review Event</h1>
        <input
          className="dashboard-list-search"
          type="search"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Title</th>
              <th>Location</th>
              <th>Edit</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading || allRowsLoading ? (
              <tr>
                <td colSpan="7" className="dashboard-table-loading-cell">
                  <div className="dashboard-table-loading">
                    <GridLoader color={"#0A4044"} loading={tableLoading} size={10} />
                  </div>
                </td>
              </tr>
            ) : visibleEvents.length > 0 ? (
            visibleEvents.map((event, index) => (
              <tr key={event.id}>
                <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.title}</td>
                <td>{event.location}</td>
                <td>
                <Link
                  href={{
                    pathname: '/dashboard/review-event/edit-event',
                    query: {
                      id: event.id
                    }
                  }}
                >
                  Edit Event
                </Link>
                                  
                </td>
                <td>
                  <button
                    onClick={() => handleApprovalChange(event.id)}
                    className={`approve-btn ${approvalStatus[event.id] ? 'approved' : 'pending'}`}
                  >
                    {approvalStatus[event.id] ? 'Approved' : 'Approve'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(event.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="7" className="dashboard-table-empty-cell">
                  <div className="dashboard-table-empty">No events found.</div>
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
    </div>
  );
};

export default ReviewEvent;
