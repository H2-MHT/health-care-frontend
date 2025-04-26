import React from "react";

const Select = ({
  label,
  name,
  register,
  error,
  disabled,
  options = [],
  onChange,
  value,
  placeholder = "Select",
  width,
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block font-medium mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        style={{ width: width }}
        {...(register ? register(name) : {})}
        disabled={disabled}
        value={value}
        defaultValue=""
        onChange={onChange}
        className={`form-control border-radus-12 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="" disabled style={{ color: "lightgray" }}>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Select;
