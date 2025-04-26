import React, { useEffect, useRef, useState } from 'react';

const ProgressCircle = ({ percentage }) => {
  const circleRef = useRef(null);
  const [strokeDashoffset, setStrokeDashoffset] = useState(440);

  useEffect(() => {
    // Calculate the new strokeDashoffset based on the percentage
    const offset = 440 - (440 * percentage / 100);
    setStrokeDashoffset(offset);
  }, [percentage]);

  return (
    <div className="circle-wrapper">
      <div className="circle1">
        <h5>{percentage}%</h5>
        <p>returns</p>
      </div>
      <svg className="circle-progress" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <circle className="background" cx="75" cy="75" r="50" stroke="#ddd" strokeWidth="3" fill="none"/>
        <circle
          ref={circleRef}
          className="progress"
          cx="75"
          cy="75"
          r="50"
          stroke="#4caf50"
          strokeWidth="3"
          fill="none"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
