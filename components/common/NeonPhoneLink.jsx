import React, { useEffect, useRef, useState } from 'react';

const NeonPhoneLink = ({currentCompany}) => {
  const message = `Helpline: ${currentCompany?.phone1 || currentCompany?.phone2} `;
  // const phoneNumber = "+919845272560";

  const neonBaseColor = "white";
  const neonTextColor = "yellow";
  const flashSpeed = 100;

  const [colors, setColors] = useState([]);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);  

  useEffect(() => {
    // Initialize span colors
    setColors(Array(message.length).fill(neonBaseColor));
    startFlashing();

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const startFlashing = () => {
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      setColors((prevColors) => {
        const newColors = Array(message.length).fill(neonBaseColor);
        newColors[indexRef.current] = neonTextColor;
        return newColors;
      });

      if (indexRef.current < message.length - 1) {
        indexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
        timeoutRef.current = setTimeout(startFlashing, 1500);
      }
    }, flashSpeed);
  };

  return (
    <a href={`tel:${currentCompany?.phone1 || currentCompany?.phone2}`}>
      {message.split('').map((char, i) => (
        <span
          key={i}
          style={{
            color: colors[i], fontWeight: "bold"
          }}
        >
          {char}
        </span>
      ))}
    </a>
  );
};

export default NeonPhoneLink;
