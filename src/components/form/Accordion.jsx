import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"; // Make sure you have Heroicons installed

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="rounded mb-1">
      <button
        onClick={onClick}
        className="w-full w-100 flex justify-between items-center text-left px-4 py-2 font-medium bg-gray-100 hover:bg-gray-200"
      >
        <span style={{float: "left"}}>{title}</span>
        {isOpen ? (
          <i className="fas fa-chevron-up" style={{float: "right"}}></i>
        ) : (
          <i className="fas fa-chevron-down" style={{float: "right"}}></i>
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white border-t text-gray-700">{content}</div>
      )}
    </div>
  );
};

const Accordion = ({list}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      {list?.length && list?.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.headline}
          content={item.description}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
