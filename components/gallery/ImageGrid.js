"use client";
import React, { useEffect, useState, useRef } from 'react';
import './ImageGrid.css';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const fancyboxInitialized = useRef(false); // Using useRef to avoid re-renders

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
    if (!fancyboxInitialized.current) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        Carousel: {
          infinite: false,
        },
      });
      fancyboxInitialized.current = true; // Set to true after initialization
    }
  }, []);

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
            <LazyLoadImage
              alt={image.caption}
              src={image.thumbnail}
              className="gallery-thumbnail"
              effect="blur" // Optional: adds a blur effect while loading
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
