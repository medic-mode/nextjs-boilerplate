"use client"
import React, { useState } from 'react';
import './AdminGallery.css';
import { InputText } from 'primereact/inputtext';
import { collection, addDoc, deleteDoc, doc  } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase'; 
import { toast, Toaster } from 'sonner';
import { GridLoader } from 'react-spinners';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import TablePaginationFooter from '../table-pagination/TablePaginationFooter';
import { useFirestorePagination } from '@/hooks/useFirestorePagination';

const AdminGallery = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle thumbnail image upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding new image to the carousel
  const handleCarouselImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      preview: URL.createObjectURL(file),
      file: file, // You might want to keep the file object for later use (e.g., uploading)
    }));

    setCarouselImages(prevImages => [...prevImages, ...newImages]);
  };

  // Handle removing the thumbnail image
  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  // Handle deleting an image from the carousel
  const handleDeleteImage = (index) => {
    const newCarouselImages = carouselImages.filter((_, i) => i !== index);
    setCarouselImages(newCarouselImages);
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `gallery/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef); // Get the URL of the uploaded image
  };

  // Handle uploading gallery data to Firestore
  const handleUploadGallery = async () => {
    setSubmitted(true)
    if (!thumbnail || !caption || carouselImages.length === 0) {
      alert("Please upload a thumbnail, caption, and at least one carousel image.");
      return;
    }

    try {
      // Upload thumbnail and get its URL
      const thumbnailUrl = await uploadImage(thumbnail);

      // Upload carousel images and get their URLs
      const carouselImageUrls = await Promise.all(
        carouselImages.map(async (img) => await uploadImage(img.file))
      );

      // Create a new gallery item
      const newGalleryItem = {
        thumbnail: thumbnailUrl,
        caption,
        carouselImages: carouselImageUrls,
      };

      // Add the new gallery item to Firestore
      const galleryRef = collection(db, 'gallery');
      await addDoc(galleryRef, newGalleryItem);
      toast.success('Gallery added successfully!', {
        duration: 3000 
      }); 

      // Reset state after successful upload
      setThumbnail(null);
      setThumbnailPreview(null);
      setCaption('');
      setCarouselImages([]);
    } catch (error) {
      console.error("Error uploading gallery: ", error);
      toast.error('Failed to upload gallery. Please try again.', {
        duration: 3000 
      });
    }finally {
      setSubmitted(false); 
    }
  };

  const {
    rows: galleryItems,
    setRows: setGalleryItems,
    allRows,
    allRowsLoading,
    fetchAllRows,
    loading,
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
    collectionName: 'gallery',
    orderDirection: 'asc',
  });
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchableGalleryItems = normalizedSearch ? allRows || [] : galleryItems;
  const visibleGalleryItems = normalizedSearch
    ? searchableGalleryItems.filter((item) =>
        [item.caption].some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      )
    : galleryItems;

  React.useEffect(() => {
    if (normalizedSearch) {
      fetchAllRows();
    }
  }, [normalizedSearch, fetchAllRows]);

  const fetchGallery = async () => {
    await fetchFirstPage();
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    
    if (confirmDelete) {
      const itemRef = doc(db, 'gallery', id);
      try {
        await deleteDoc(itemRef);
        setGalleryItems(galleryItems.filter(item => item.id !== id));
        toast.success("Gallery item deleted successfully");
      } catch (error) {
        console.error("Error deleting gallery item: ", error);
        toast.error("Failed to delete the gallery item");
      }
    } 
  };

  return (
    <div className='admin-gallery'>
      <Toaster position="top-center" richColors /> 
      <div className="dashboard-list-toolbar">
        <h1>Gallery Images</h1>
        <input
          className="dashboard-list-search"
          type="search"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="upload-image">
        
        <div className="g-field">
          <label htmlFor="thumbnail">Thumbnail Image</label>
          {!thumbnailPreview && (
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailUpload}
              required
            />
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {thumbnailPreview && (
              <div className="thumbnail-preview" style={{ marginTop: '10px', position: 'relative' }}>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{ width: '250px', height: '150px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
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
        </div>

        <div className="g-field">
          <label htmlFor="caption">Caption</label>
          <InputText
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="g-field">
        <label htmlFor="images">Images</label>
        <input
          type="file"
          id="carouselImageInput"
          accept="image/*"
          multiple
          onChange={handleCarouselImageUpload}
          style={{ display: 'none' }}
          
        />
        <button
          className='add-new-btn'
          type="button"
          onClick={() => document.getElementById('carouselImageInput').click()}
        >
          Add New
        </button>
      </div>

      <div className="carousel-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {carouselImages.map((img, index) => (
          <div key={index} className="carousel-image-preview" style={{ marginTop: '10px', position: 'relative' }}>
            <img
              src={img.preview}
              alt={`Carousel Preview ${index}`}
              style={{ width: '120px', height: '100px', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
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
      <Button 
            className="upload-gallery-btn" 
            type="submit" 
            label={submitted ? <i className="pi pi-spin pi-spinner"></i> : "Upload"} 
            disabled={submitted} 
            onClick={handleUploadGallery}
          />

        <hr style={{border:'1px solid var(--dark-green)', margin: '20px 0'}}/>
        <div className="admin-gallery-view">
          <div className="table-responsive">
              <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Caption</th>
                  <th>Thumbnail</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading || allRowsLoading ? (
                  <tr>
                    <td colSpan="4" className="dashboard-table-loading-cell">
                      <div className="dashboard-table-loading">
                        <GridLoader color={"#0A4044"} loading={loading} size={10} />
                      </div>
                    </td>
                  </tr>
                ) : visibleGalleryItems.length > 0 ? (
                visibleGalleryItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{normalizedSearch ? index + 1 : (page - 1) * pageSize + index + 1}</td> 
                    <td className="caption-cell">{item.caption}</td>
                    <td>
                      <img src={item.thumbnail} alt={item.caption} style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>
                      <button className='gallery-delete-btn' onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="4" className="dashboard-table-empty-cell">
                      <div className="dashboard-table-empty">No gallery items found.</div>
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
            disabled={loading}
          />}
        </div>

    </div>
  );
};

export default AdminGallery;
