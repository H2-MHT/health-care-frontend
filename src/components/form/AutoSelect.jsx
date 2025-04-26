import React from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

const AutoSelect = ({
  label,
  name,
  register,
  error,
  disabled,
  className,
  options = [],
  onChange,
  isMulti,
  value,
  placeholder = "Select",
  width,
  isSearchable = false, // Enable search (autocomplete)
}) => {
    const { t } = useTranslation(); // Initialize translation hook
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block font-medium mb-1">
        {t(label)} {/* Use translation for label */}
      </label>
      )}
      <ReactSelect
        id={name}
        name={name}
        isMulti={isMulti}
        options={options}
        className={className}
        placeholder={t(placeholder)}
        value={options.find((opt) => opt.value === value) || null}
        onChange={onChange}
        isDisabled={disabled}
        isSearchable={isSearchable} // Enables autocomplete
        styles={{
          control: (base) => ({
            ...base,
            width: width || "100%",
            borderRadius: "12px",
            height:"56px",
            borderColor: error ? "red" : "#c6cbcc",
            border: "1px solid #c6cbcc !important"
          }),
        }}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AutoSelect;
