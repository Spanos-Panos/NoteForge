"use client";

import { useState, useEffect } from "react";
import styles from "./ImageDisplay.module.css";

interface ImageDisplayProps {
  imageSrc: string;
  alt?: string;
  editable?: boolean;
  availableImages?: string[];
  onImageChange?: (newImageSrc: string) => void;
  width?: string;
  height?: string;
}

export default function ImageDisplay({
  imageSrc,
  alt = "Image",
  editable = false,
  availableImages = [],
  onImageChange,
  width = "100%",
  height = "auto",
}: ImageDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageSrc);

  // Update currentImage when imageSrc prop changes
  useEffect(() => {
    setCurrentImage(imageSrc);
  }, [imageSrc]);

  const handleImageSelect = (newImage: string) => {
    setCurrentImage(newImage);
    if (onImageChange) {
      onImageChange(newImage);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    if (editable && availableImages.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`${styles.imageContainer} ${editable ? styles.editable : ""}`}
        style={{ width, height }}
      >
        <img
          src={currentImage}
          alt={alt}
          className={styles.image}
        />
        {editable && (
          <button
            className={styles.editButton}
            onClick={handleEditClick}
            aria-label="Edit image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.editIcon}
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Select an Image</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.imageGrid}>
              {availableImages.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.imageOption} ${
                    image === currentImage ? styles.selected : ""
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img src={image} alt={`Option ${index + 1}`} />
                  {image === currentImage && (
                    <div className={styles.selectedBadge}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

