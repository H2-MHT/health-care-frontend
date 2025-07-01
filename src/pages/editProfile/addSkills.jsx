import React, { useState } from "react";

const allSkills = [
  "Java",
  "JavaScript",
  "PHP",
  "Python",
  "React",
  "Angular",
  "Node.js",
  "HTML",
  "CSS",
  "SQL",
  "MongoDB",
  "C++",
  "C#",
  "TypeScript",
  "Django",
];

export default function SkillsInput({ setSkills, skills=null }) {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const suggestions = allSkills?.filter(
      (skill) =>
        skill?.toLowerCase().startsWith(value?.toLowerCase()) &&
        !skills?.includes(skill)
    );
    setFilteredSuggestions(suggestions);
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills?.includes(trimmed)) {
      console.log(">>>>>>>>>>>>skills", skills, trimmed)
      if(skills)
      setSkills([...skills, trimmed]);
    else
    setSkills([trimmed]);
    }
    setInput("");
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length === 0) {
        addSkill(input);
      }
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill"
          style={{
            width: "100%",
            padding: "10px 35px 10px 10px",
            fontSize: "14px",
            border: "1px solid #c6cbcc",
            borderRadius: "12px",
          }}
        />

        {/* Plus Icon if no match */}
        {input && filteredSuggestions.length === 0 && (
          <span
            onClick={() => addSkill(input)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "18px",
              color: "#007bff",
              fontWeight: "bold",
            }}
            title={`Add "${input}"`}
          >
            +
          </span>
        )}

        {/* Suggestions Dropdown */}
        {filteredSuggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "150px",
              overflowY: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderTop: "none",
              zIndex: 10,
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => addSkill(suggestion)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Selected Skills Outside Input */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {skills?.map((skill, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#e0e0e0",
              borderRadius: "15px",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {skill}
            <span
              onClick={() => removeSkill(index)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
