"use client"
import './CreateCourse.css'
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner';
import { db, storage } from '../../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { useRouter } from 'next/navigation';


const CreateCourse = () => {

    const [courseTitle, setCourseTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [mode, setMode] = useState('')
    const [audience, setAudience] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [courseDescription, setCourseDescription] = useState('');
    const [topics, setTopics] = useState('');
    const [trainer, setTrainer] = useState('');
    const [priceDetail, setPriceDetail] = useState('')
    const [price, setPrice] = useState(0)
    const [highlights, setHighlights] = useState('')
    const ratingValue = 3.5

    const navigate = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          let thumbnailURL = '';
    
          // If a thumbnail is uploaded, upload it to Firebase Storage
          if (thumbnail) {
            const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
            const uploadSnapshot = await uploadBytes(storageRef, thumbnail);
            thumbnailURL = await getDownloadURL(uploadSnapshot.ref); // Get the URL of the uploaded thumbnail
          }
    
          // Add the post data to Firestore, including the thumbnail URL
          const docRef = await addDoc(collection(db, 'courses'), {
            courseTitle,
            duration,
            audience,
            courseDescription,
            topics,
            mode,
            trainer,
            thumbnail: thumbnailURL, // Store the URL, not the File object
            dateCreated: new Date().toISOString(),
            approved: 'no',
            priceDetail,
            price,
            highlights,
            ratingValue
          });
    
          console.log('Document written with ID: ', docRef.id);
    
          // Reset the form after submission
          setCourseTitle('');
          setDuration('');
          setAudience([]);
          setThumbnail(null);
          setPreview(null);
          setCourseDescription('')
          setTopics('')
          setMode('')
          setTrainer('')
          setPriceDetail('')
          setPrice(0)
          setHighlights('')
    
          toast.success('Course saved successfully.', {
            duration: 3000 
          });
          navigate.push('/dashboard'); 
          window.scrollTo(0, 0);
    
        } catch (e) {
          console.error('Error adding document: ', e);
          toast.error(('Course not saved', e), {
            duration: 3000 
          });
        }
      };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          setThumbnail(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result); // Create a preview of the image
          };
          reader.readAsDataURL(file);
        }
      };
    
      const handleRemoveImage = () => {
        setThumbnail(null);
        setPreview(null);
      };

      const handleModeChange = (isChecked, modeValue) => {
        if (isChecked) {
          setMode((prev) => (prev ? `${prev},${modeValue}` : modeValue)); // Add the mode
        } else {
          setMode((prev) => prev.split(',').filter((item) => item !== modeValue).join(',')); // Remove the mode
        }
      };

      const handlePriceDetailChange = (priceDetailValue) => {
        setPriceDetail(prev => prev === priceDetailValue ? '' : priceDetailValue);
    };

   

  return (
    <div className="create-course-container">
        <Toaster position="top-center" richColors/>
        <h1>Create Course</h1>
        <form onSubmit={handleSubmit}>
            <div className="p-field">
                <label htmlFor="courseTitle">Course Title</label>
                <InputText
                    id="courseTitle"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="courseTitle">Trainer Name</label>
                <InputText
                    id="trainer"
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                />
            </div>
            <div className="p-field">
                <label htmlFor="minutes">Duration</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <InputText
                        type="number"
                        id="hours"
                        placeholder='Hours in hh format'
                        value={duration.hours || ''}
                        onChange={(e) => setDuration({ ...duration, hours: e.target.value })}
                        min="0"
                        required
                        style={{ flex: '1' }}
                    />
                    <InputText
                        type="number"
                        id="minutes"
                        placeholder='Minutes in mm format'
                        value={duration.minutes || ''}
                        onChange={(e) => setDuration({ ...duration, minutes: e.target.value })}
                        min="0"
                        max="59" // Limit minutes to 0-59
                        required
                        style={{ flex: '1' }}
                    />
                </div>
                </div>
                <div className="p-field">
                    <label>Mode of Teaching</label>
                    <div style={{ display: 'flex', gap: '40px', margin: '10px 0' }}>
                        <div  style={{ display: 'flex', gap: '10px'}}>
                            <input
                                type="checkbox"
                                id="online"
                                name="mode"
                                value="online"
                                checked={mode.includes('online')}
                                onChange={(e) => handleModeChange(e.target.checked, 'online')}
                            />
                            <label htmlFor="online" style={{margin: '10px 0 20px 0'}}>Online</label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px'}}>
                        <input
                            type="checkbox"
                            id="offline"
                            name="mode"
                            value="offline"
                            checked={mode.includes('offline')}
                            onChange={(e) => handleModeChange(e.target.checked, 'offline')}
                        />
                        <label htmlFor="offline" style={{margin: '10px 0 20px 0'}}>Offline</label>
                        </div>
                    </div>
                    </div>

            <div className="p-field">
                <label htmlFor="audience">Target Audience (Separate by comma)</label>
                <InputText
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value.split(',').map(kw => kw.trim()))}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="thumbnail">Upload Thumbnail Image</label>
                {!preview && (
                    <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    />
                 )}

                 {preview && ( 
                    <div className="thumbnail-preview" style={{ marginTop: '10px', position: 'relative' }}>
                    <img
                        src={preview}
                        alt="Thumbnail Preview"
                        style={{ width: 'auto', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        color: 'gray',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                    >
                        &times;
                    </button>
                    </div>
                 )}
                </div>
            <div className="p-field">
                <label htmlFor="courseDescription">Course Description</label>
                <Editor
                    className="content-editor"
                    id="courseDescription"
                    value={courseDescription}
                    onTextChange={(e) => setCourseDescription(e.htmlValue)} 
                    required
                    style={{ minHeight: '100px', backgroundColor: 'white' }}
                />
            </div>
            <div className="p-field">
                <label htmlFor="topics">Topics Covered</label>
                <Editor
                    className="content-editor"
                    id="topics"
                    value={topics}
                    onTextChange={(e) => setTopics(e.htmlValue)} 
                    required
                    style={{ minHeight: '100px', backgroundColor: 'white' }}
                />
            </div>
            <div className="p-field">
                <label htmlFor="topics">Highlights</label>
                <Editor
                    className="content-editor"
                    id="highlights"
                    value={highlights}
                    onTextChange={(e) => setHighlights(e.htmlValue)} 
                    required
                    style={{ minHeight: '100px', backgroundColor: 'white' }}
                />
            </div>
            <div className="p-field">
                    <label>Price Detail</label>
                    <div style={{ display: 'flex', gap: '40px', margin: '10px 0' }}>
                        <div  style={{ display: 'flex', gap: '10px'}}>
                            <input
                                 type="checkbox"
                                 id="paid"
                                 name="priceDetail"
                                 value="Paid"
                                 checked={priceDetail === 'Paid'}
                                 onChange={() => handlePriceDetailChange('Paid')}
                            />
                            <label htmlFor="paid" style={{margin: '10px 0 20px 0'}}>Paid</label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px'}}>
                        <input
                            type="checkbox"
                            id="free"
                            name="priceDetail"
                            value="Free"
                            checked={priceDetail === 'Free'}
                            onChange={() => handlePriceDetailChange('Free')}
                        />
                        <label htmlFor="free" style={{margin: '10px 0 20px 0'}}>Free</label>
                        </div>
                        <div style={{ display: 'flex', gap: '10px'}}>
                        <input
                            type="checkbox"
                            id="contact-us"
                            name="priceDetail"
                            value="Contact Us"
                            checked={priceDetail === 'Contact Us'}
                            onChange={() => handlePriceDetailChange('Contact Us')}
                        />
                        <label htmlFor="contact-us" style={{margin: '10px 0 20px 0'}}>Contact Us</label>
                        </div>
                    </div>
                    {priceDetail === 'Paid' && (
                      <div className="p-field">
                      <label htmlFor="price">Price</label>
                      <InputText
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                      />
                      </div>
                    )}
                </div>
            <Button className="create-course-btn" type="submit" label="Create Course" />
        </form>
    </div>
  )
}

export default CreateCourse