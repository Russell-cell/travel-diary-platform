// src/components/Waterfall/SafeImage.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SafeImage = ({ src, alt, fallback }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="image-wrapper">
      {isLoading && <div className="image-skeleton" />}
      <img
        src={imgSrc}
        alt={alt}
        style={{ display: isLoading ? 'none' : 'block' }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

SafeImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.string.isRequired
};