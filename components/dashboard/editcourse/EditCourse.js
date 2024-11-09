"use client"
import React, {  useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { db, storage } from '../../../lib/firebase'; // Adjust the path as necessary
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast, Toaster } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const EditCourse = () => {

  const searchParams = useSearchParams();  // This will fetch query parameters
  const courseId = searchParams.get('id');

  const [courseTitle, setCourseTitle] = useState(searchParams.get('courseTitle') || '');
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || '');
  const [audience, setAudience] = useState(searchParams.get('audience') || []);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(searchParams.get('thumbnail') ? JSON.parse(searchParams.get('thumbnail')) : null); 
  const [courseDescription, setCourseDescription] = useState(searchParams.get('courseDescription') || '');
  const [topics, setTopics] = useState(searchParams.get('topics') || '');
  const [trainer, setTrainer] = useState(searchParams.get('trainer') || '');
  const [priceDetail, setPriceDetail] = useState(searchParams.get('priceDetail') || '');
  const [price, setPrice] = useState(Number(searchParams.get('price')) || 0);
  const [highlights, setHighlights] = useState(searchParams.get('highlights') || '');
  
  const ratingValue = parseFloat(searchParams.get('ratingValue')) || 3.5;
  
  
    const navigate = useRouter()

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const storageRef = ref(storage, `thumbnails/${file.name}`);
        uploadBytes(storageRef, file)
          .then(() => getDownloadURL(storageRef))
          .then((url) => {
            setThumbnail(url);
            setPreview(url);
          })
          .catch((error) => {
            toast.error('Error uploading image');
            console.error('Error uploading image:', error);
          });
      }
    };
  
    // Handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await updateDoc(doc(db, 'courses', courseId), {
          courseTitle,
          duration,
          mode,
          audience,
          preview,
          courseDescription,
          thumbnail: thumbnail || state.thumbnail, 
          approved: 'no',
          topics,
          trainer,
          priceDetail,
          price,
          highlights,
          updatedDate: new Date().toISOString(), 
          ratingValue
        });
        toast.success('Course updated successfully');
  
        navigate.push('/dashboard')
      } catch (error) {
        toast.error('Error updating course');
        console.error('Error updating course:', error);
      }
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
        <h1>Edit Course</h1>
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
                        onClick={() => {
                          setPreview('');
                          setThumbnail(null);
                        }}
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
                                 value={priceDetail}
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
                            value={priceDetail}
                            checked={priceDetail === 'Free'}
                            onChange={() => handlePriceDetailChange('Free')}
                        />
                        <label htmlFor="free" style={{margin: '10px 0 20px 0'}}>Free</label>
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
            <Button className="create-course-btn" type="submit" label="Update Course" />
        </form>
    </div>
  )
}

export default EditCourse