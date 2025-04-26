import React from "react";

const SmallLoader = () => {
  return (
    <span
      style={{
        display: "inline-block",
        width: "18px",
        height: "18px",
        border: "2px solid #f3f3f3",
        borderTop: "2px solid #3498db",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    ></span>
  );
};

export default SmallLoader ; 
