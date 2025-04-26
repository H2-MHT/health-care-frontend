import React from "react";

const Image = ({ src, alt, className}) => {
  return (
    <img
      src={src || "/images/sample.png"} 
      alt={alt || "Image"} 
      className={className}
    />
  );
};

export default Image;
