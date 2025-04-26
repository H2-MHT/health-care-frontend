import React from "react";
import "./loader.css";

export const Loader = () => {
  return (
    <div className="loading">
      <div className="loader">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export const LoaderHome = () => {
  return (
    <div className="loading loading2">
      <div className="loader">
        <div className="spinner"></div>
      </div>
    </div>
  );
};