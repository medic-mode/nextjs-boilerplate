"use client"
import React, { useEffect, useState } from 'react';
import './CreatePost.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor'; 
import { db, storage } from '../../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { GridLoader } from 'react-spinners';


const CreatePost = () => {

  const {userEmail, logged, loading} = useAuth()

  const [author, setAuthor] = useState('');
  const [coAuthor, setCoAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState([]);
  const [reference, setReference] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [slideImages, setSlideImages] = useState([]);
  const [slidePreviews, setSlidePreviews] = useState([]);


  const navigate = useRouter();

 

  useEffect(() => {
    if (logged === false) {
      const timeout = setTimeout(() => {
        navigate.push('/blogs');
      }, 500);

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    }
  }, [logged, navigate]);

  if (!logged) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let thumbnailURL = '';
      const slideImageURLs = [];

      // If a thumbnail is uploaded, upload it to Firebase Storage
      if (thumbnail) {
        const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
        const uploadSnapshot = await uploadBytes(storageRef, thumbnail);
        thumbnailURL = await getDownloadURL(uploadSnapshot.ref); // Get the URL of the uploaded thumbnail
      }

      for (const slide of slideImages) {
        const slideRef = ref(storage, `slides/${slide.name}`);
        const uploadSnapshot = await uploadBytes(slideRef, slide);
        const slideURL = await getDownloadURL(uploadSnapshot.ref);
        slideImageURLs.push(slideURL); // Store each slide's URL
      }

      // Add the post data to Firestore, including the thumbnail URL
      const docRef = await addDoc(collection(db, 'blogPosts'), {
        author,
        coAuthor,
        title,
        category,
        content,
        keyword,
        reference,
        thumbnail: thumbnailURL, 
        slideImages: slideImageURLs,
        dateCreated: new Date().toISOString(),
        approved: 'no',
        youtubeUrl
      });


      // Reset the form after submission
      setAuthor('');
      setCoAuthor('');
      setTitle('');
      setCategory('');
      setContent('');
      setKeyword([]);
      setReference('');
      setThumbnail(null);
      setPreview(null);
      setYoutubeUrl('')
      setSlideImages([]);
      setSlidePreviews([]);

      if (location.pathname === '/blogs/create-post') {
        alert("Your blog has been successfully received! It will be validated and displayed on our site within 24 hours.");
        navigate.push('/blogs'); 
      } else if (location.pathname === '/dashboard/create-post') {
        toast.success('Blog saved successfully.', {
          duration: 3000 
        });
        window.scrollTo(0, 0);
      }

    } catch (e) {
      console.error('Error adding document: ', e);
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

  const handleSlideUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSlideImages(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSlidePreviews(newPreviews); 
    }
  };

  const handleRemoveSlide = (index) => {
    const newSlides = slideImages.filter((_, i) => i !== index);
    const newPreviews = slidePreviews.filter((_, i) => i !== index);
    setSlideImages(newSlides);
    setSlidePreviews(newPreviews);
  };

  


  return (
   
    <div className="create-post-container">
      <Toaster position="top-center" richColors/>
      <h1>Create Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="author">Author Full Name</label>
          <InputText
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="coAuthor">Co Authors Name (If applicable) (Separate by comma)</label>
          <InputText
            id="coAuthor"
            value={coAuthor}
            onChange={(e) => setCoAuthor(e.target.value)}
          />
        </div>

        <div className="p-field">
          <label htmlFor="title">Title of the Blog</label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a Category</option>
            <option value="Blog">Blog</option>
            <option value="Article">Article</option>
            <option value="Case Study">Case Study</option>
            <option value="Opinion Piece">Opinion Piece</option>
            <option value="Review">Review</option>
            <option value="CPR and First Aid">CPR and First Aid</option>
            <option value="Emergency Medical Services">Emergency Medical Services</option>
            <option value="EMS Wall of Fame">EMS Wall of Fame</option>
            <option value="Medicmode Events">Medicmode Events</option>
            <option value="Medicmode PPT">Medicmode PPT</option>
            <option value="Medicmode Protocols">Medicmode Protocols</option>
            <option value="Research">Research</option>
          </select>
        </div>
        <div className="p-field">
          <label htmlFor="keyword">Keywords (Optional) (Separate by comma)</label>
          <input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.split(',').map(kw => kw.trim()))}
          />
        </div>

        <div className="p-field">
          <label htmlFor="reference">References (If applicable)</label>
          <input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
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
          <label htmlFor="slideImages">Upload Slide Images (multiple)</label>
          <input
            type="file"
            id="slideImages"
            accept="image/*"
            multiple
            onChange={handleSlideUpload}
          />
          {slidePreviews.length > 0 && (
            <div className="slides-preview" style={{ marginTop: '10px' }}>
              {slidePreviews.map((preview, index) => (
                <div key={index} className="slide-preview" style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                  <img
                    src={preview}
                    alt={`Slide Preview ${index + 1}`}
                    style={{ width: '100px', height: '75px', objectFit: 'cover' }}
                  />
                  <button type="button" onClick={() => handleRemoveSlide(index)} style={{ /* styles */ }}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="content">Content</label>
          <Editor
            className="content-editor"
            id="content"
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)} // Get the HTML value
            required
            style={{ minHeight: '300px', backgroundColor: 'white' }}
          />
        </div>
          {userEmail === 'admin@medicmode.com' && (
            <div className="p-field">
              <label htmlFor="youtubeUrl">Youtube Link</label>
              <InputText
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
          )}
        
        <Button className="create-post-btn" type="submit" label="Create Post" />
      </form>
    </div>
  );
};



export default CreatePost;
