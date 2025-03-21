"use client"
import "./EditPost.css"
import React, {  useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { db, storage } from '../../../lib/firebase'; // Adjust the path as necessary
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { toast, Toaster } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const EditPost = () => {
  const searchParams = useSearchParams();  // This will fetch query parameters
  const postId = searchParams.get('id');  // Fetch 'id' from the URL query


  const [author, setAuthor] = useState('');
  const [authorImg, setAuthorImg] = useState(null);
  const [authorImgPreview, setAuthorImgPreview] = useState(null);
  const [coAuthor, setCoAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState([]);
  const [reference, setReference] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [slideImages, setSlideImages] = useState([]);
  const [slidePreviews, setSlidePreviews] = useState([]);

  useEffect(() => {
    async function fetchPostData() {
      if (!postId) return;

      const docRef = doc(db, 'blogPosts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();

        setAuthor(postData.author || '');
        setAuthorImg(postData.authorImg || null);
        setAuthorImgPreview(postData.authorImg || null);
        setCoAuthor(postData.coAuthor || '');
        setTitle(postData.title || '');
        setCategory(postData.category || '');
        setContent(postData.content || '');
        setKeyword(postData.keyword || []);
        setReference(postData.reference || '');
        setThumbnail(postData.thumbnail || null);
        setPreview(postData.thumbnail || null); // For previewing
        setYoutubeUrl(postData.youtubeUrl || '');
        setSlideImages(postData.slideImages || []);
        setSlidePreviews(postData.slideImages || []); // For previewing slide images
      }
    }

    fetchPostData();
  }, [postId]);
 

  const navigate = useRouter()

  // Handle thumbnail image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);;
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setThumbnail(url); // Set the thumbnail URL
          setPreview(url); // Set the preview URL (if needed)
        })
        .catch((error) => {
          toast.error('Error uploading image');
          console.error('Error uploading image:', error);
        });
    }
  };

  const handleAuthorImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `authorImg/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setAuthorImg(url); // Set the thumbnail URL
          setAuthorImgPreview(url); // Set the preview URL (if needed)
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
      await updateDoc(doc(db, 'blogPosts', postId), {
        author,
        authorImg,
        authorImgPreview,
        coAuthor,
        title,
        category,
        content,
        keyword,
        reference,
        thumbnail: thumbnail || state.thumbnail,
        slideImages: slideImages || state.slideImages,
        approved: 'no',
        youtubeUrl,
        updatedDate: new Date().toISOString()
      });
      toast.success('Post updated successfully');
      navigate.push('/dashboard/review-post');
    } catch (error) {
      toast.error('Error updating post');
      console.error('Error updating post:', error);
    }
  };
  
  // Handle multiple slide uploads
  const handleSlideUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newSlideUrls = await Promise.all(files.map(async (file) => {
      const slideStorageRef = ref(storage, `slideImages/${uuidv4()}-${file.name}`);
      await uploadBytes(slideStorageRef, file); // Upload each file
      return await getDownloadURL(slideStorageRef); // Get the download URL
    }));
  
    // Update the state with new slide URLs
    setSlideImages((prev) => [...prev, ...newSlideUrls]);
    setSlidePreviews((prev) => [...prev, ...newSlideUrls]); // If you want to keep previews as well
  };
  
  // Function to remove a slide
  const handleRemoveSlide = (index) => {
    const newSlides = slideImages.filter((_, i) => i !== index);
    const newPreviews = slidePreviews.filter((_, i) => i !== index);
  
    // Update the state with the new arrays after removing the slide
    setSlideImages(newSlides);
    setSlidePreviews(newPreviews);
  };
  

  return (
    <div className="edit-post-container">
      <Toaster position="top-center" richColors />
      <h1>Edit Blog</h1>
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
          <label htmlFor="authorImg">Upload Author Image</label>
          {!authorImgPreview && (
            <input
              type="file"
              id="authorImg"
              accept="image/*"
              onChange={handleAuthorImageUpload}
              required
            />
          )}

          {authorImgPreview && (
            <div className="thumbnail-preview" style={{ marginTop: '10px', position: 'relative' }}>
              <img
                src={authorImgPreview}
                alt="authorImg Preview"
                style={{ width: 'auto', height: '150px', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => {
                  setAuthorImgPreview(null);
                  setAuthorImg(null);
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
            value={keyword.join(', ')}
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
                  style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(index)}
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
        <div className="p-field">
              <label htmlFor="youtubeUrl">Youtube Link</label>
              <InputText
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
        </div>

        <Button className="create-post-btn" type="submit" label="Update Post" />
      </form>
    </div>
  );
};

export default EditPost;
