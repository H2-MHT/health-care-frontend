import React from "react";
import Multiselect from "multiselect-react-dropdown";
 
const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, register, name, label, defaultValue }) => {
  const handleSelect = (selectedList) => {
    onChange(selectedList);
  };

  return (
    <>
    <label htmlFor={name}>{label}</label>
    <Multiselect
      options={options}
      register={register}
      defaultValue={defaultValue}
      name={name}
      displayValue="name"
      selectedValues={selectedValues}
      onSelect={handleSelect}
      onRemove={handleSelect}
      placeholder={placeholder || "Select Options"}
      style={{
        multiselectContainer: { width: label? "100%" : "300px" },
        chips: { background: "#3b82f6" },
      }}
    />
    </>
  );
};

export default MultiSelectDropdown;
