"use client"
import React, { useEffect, useState } from 'react';
import './ImageGrid.css';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [fancyboxInitialized, setFancyboxInitialized] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryRef = collection(db, 'gallery');
        const gallerySnapshot = await getDocs(galleryRef);
        const imagesArray = gallerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setImages(imagesArray);
      } catch (error) {
        console.error("Error fetching images from Firestore: ", error);
      }
    };

    fetchImages();

    // Initialize Fancybox only once
    if (!fancyboxInitialized) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        Carousel: {
          infinite: false,
        },
      });
      setFancyboxInitialized(true);
    }
  }, [fancyboxInitialized]); // Only run when fancyboxInitialized changes

  return (
    <div
      className="image-gallery"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      
      {images.map((image) => (
        <div key={image.id} className="image-wrapper">
          
          <a
            data-fancybox="gallery"
            href={image.carouselImages[0]}
            data-caption={image.caption}
          >
            <img
              alt=""
              src={image.thumbnail}
              className="gallery-thumbnail"
            />
          </a>
          <div className="gallery-caption">
            {image.caption}
          </div>
          {image.carouselImages.slice(1).map((carouselImage, index) => (
            <a
              key={index}
              data-fancybox="gallery"
              href={carouselImage}
              style={{ display: 'none' }}
              data-caption={image.caption}
              aria-label={`View ${image.caption}`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
