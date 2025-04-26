import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComp = ({ label, selectedDate, onChange }) => {
  return (
    <div className="col-md-6">
      <label>{label}</label>
      <DatePicker
        selected={selectedDate ? new Date(selectedDate + "-01") : null}
        onChange={(date) => onChange(date ? date.toISOString().slice(0, 7) : null)}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        className="border p-2 rounded-md shadow-sm"
        placeholderText={`Choose ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default DatePickerComp;
