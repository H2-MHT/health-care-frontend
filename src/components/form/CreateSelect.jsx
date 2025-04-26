import React from "react";
import CreatableSelect from "react-select/creatable";

const CreateSelect = ({ options, name, isSearchable, onChange, value, width, error }) => {
  return (
    <div className="mb-4">
      <CreatableSelect
        options={options}
        name={name}
        isSearchable={isSearchable}
        onChange={onChange}
        value={value}
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
    </div>
  );
};

export default CreateSelect;
