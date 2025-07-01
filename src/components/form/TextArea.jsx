import React from "react";

const TextArea = React.forwardRef(({type,rows = 3, error, label, placeholder = "", name, ...field }, ref) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        {...field}              // Includes value, onChange, name
        id={name}
        type={type}
        ref={ref}               // Must forward ref
        rows={rows}
        className={`textarea ${error ? "error" : ""}`}
        placeholder={placeholder}
      />
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error.message}</p>}
    </div>
  );
});

export default TextArea;

