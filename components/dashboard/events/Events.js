"use client"
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { db } from '../../../lib/firebase'; // import the Firestore database
import { collection, addDoc } from 'firebase/firestore'; // import Firestore methods
import './Events.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';

const Events = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true)

    try {
      await addDoc(collection(db, 'events'), {
        title,
        location,
        date,
        description,
      });
      toast.success('Event created successfully!');

      // Clear input fields
      setTitle('');
      setLocation('');
      setDate('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
      console.error("Error adding document: ", error);
    }finally {
      setSubmitted(false); 
    }
  };

  return (
    <div className="create-events-container">
      <Toaster position="top-center" richColors />
      <h1>Create an Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="title">Event Title*</label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="location">Event Location*</label>
          <InputText
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="date">Event Date*</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="description">Description*</label>
          <textarea
            rows="3"
            style={{ resize: 'vertical', width: 'auto' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <p>*Required fields</p>
        <Button
            className="create-events-btn" 
            type="submit" 
            label={submitted ? <i className="pi pi-spin pi-spinner"></i> : "Create Event"} 
            disabled={submitted} 
          />
      </form>
    </div>
  );
};

export default Events;
