import React from 'react';

// Reusable LoadingButton Component
const LoadingButton = ({ loading, type, onClick, className, style, buttonText, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading} 
      className={className}
      type={type}
      style={{
        position: "relative", 
        ...style,
      }}
      {...props} 
    >
    
    {buttonText}  

      {loading && (
        <div
          className="spinner-button"
          
        ></div>
      )}
      
    </button>
  );
};

export default LoadingButton;
