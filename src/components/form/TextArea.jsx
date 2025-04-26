import React from "react";

const TextArea = ({ rows = 3, error, label, placeholder = "", name, register, field }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        {...field} // Spread field props to correctly bind the value and onChange
        {...(register ? register(name) : {})} // Ensure register is called correctly
        id={name}
        rows={rows}
        name={name}
        className={`textarea ${error ? "error" : ""}`}
        placeholder={placeholder}
      />
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error.message}</p>}
    </div>
  );
};

export default TextArea;
