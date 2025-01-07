import React from 'react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`Gallery Image ${idx + 1}`}
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
