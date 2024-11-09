"use client"
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase'; // Import Firestore configuration
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './ReviewEvent.css';
import Link from 'next/link';

const ReviewEvent = () => {

  
  const [events, setEvents] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        sNo: index + 1,
        ...doc.data(),
      }));
      setEvents(eventsData);

      // Set initial approval status
      const initialApproval = {};
      eventsData.forEach((event) => {
        initialApproval[event.id] = event.approved || false;
      });
      setApprovalStatus(initialApproval);
    };

    fetchEvents();
  }, []);

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

  return (
    <div className="review-event-container">
      <h1>Review Event</h1>
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
            {events.map((event, index) => (
              <tr key={event.id}>
                <td>{index + 1}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.title}</td>
                <td>{event.location}</td>
                <td>
                <Link
                  href={{
                    pathname: '/dashboard/review-event/edit-event',
                    query: {
                      id: event.id,
                      date: event.date,
                      title: event.title,
                      location: event.location,
                      description: event.description
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewEvent;
