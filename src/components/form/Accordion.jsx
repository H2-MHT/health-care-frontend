import React, { useState } from "react";
// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"; // Make sure you have Heroicons installed

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border rounded mb-2">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left px-4 py-2 font-medium bg-gray-100 hover:bg-gray-200"
      >
        <span>{title}</span>
        {/* {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-600" />
        )} */}
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white border-t text-gray-700">{content}</div>
      )}
    </div>
  );
};

const Accordion = () => {
  const items = [
    {
      title: "What is Health Quest?",
      content: "It’s a gamified wellness journey for patients.",
    },
    {
      title: "How does Symptom Checker work?",
      content: "Patients select symptoms and get NHS-based advice.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
