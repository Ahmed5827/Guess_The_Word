import { useState, useRef, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./LetterCircle.css";

function LetterCircle({ letters, onWordChange }) {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentMousePos, setCurrentMousePos] = useState(null);
  const circleRef = useRef(null);
  const letterRefs = useRef([]);
  const svgRef = useRef(null);
  const redSquareRef = useRef(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (circleRef.current) {
        updateLetterPositions();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [letters]);

  // Notify parent of the selected word
  useEffect(() => {
    if (onWordChange) {
      onWordChange(selectedLetters.join(""));
    }
  }, [selectedLetters, onWordChange]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      e.preventDefault();
      setIsMouseDown(true);
      setSelectedLetters([]);
      setLines([]);
      setCurrentMousePos(null);
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 0) {
      setIsMouseDown(false);
      setCurrentMousePos(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = redSquareRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    setCurrentMousePos({ x: mouseX, y: mouseY });

    let closestLetter = null;
    letterRefs.current.forEach((letterRef, index) => {
      const rect = letterRef.getBoundingClientRect();
      const isWithinLetter =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isWithinLetter) {
        closestLetter = letters[index];
      }
    });

    if (closestLetter && !selectedLetters.includes(closestLetter)) {
      setSelectedLetters((prev) => [...prev, closestLetter]);

      if (selectedLetters.length > 0) {
        const prevLetterRect =
          letterRefs.current[
            letters.indexOf(selectedLetters[selectedLetters.length - 1])
          ].getBoundingClientRect();
        const currentLetterRect =
          letterRefs.current[
            letters.indexOf(closestLetter)
          ].getBoundingClientRect();

        const lineX1 =
          prevLetterRect.left + prevLetterRect.width / 2 - containerRect.left;
        const lineY1 =
          prevLetterRect.top + prevLetterRect.height / 2 - containerRect.top;
        const lineX2 =
          currentLetterRect.left +
          currentLetterRect.width / 2 -
          containerRect.left;
        const lineY2 =
          currentLetterRect.top +
          currentLetterRect.height / 2 -
          containerRect.top;

        setLines((prevLines) => [
          ...prevLines,
          {
            x1: lineX1,
            y1: lineY1,
            x2: lineX2,
            y2: lineY2,
          },
        ]);
      }
    }
  };

  const updateLetterPositions = () => {
    if (!redSquareRef.current) return;

    const containerRect = redSquareRef.current.getBoundingClientRect();
    const circleDiameter = containerRect.width;
    const circleRadius = circleDiameter / 2;
    const letterRadius = circleRadius - 26; // Adjust as needed

    letterRefs.current.forEach((letterRef, index) => {
      const angle = (index * 360) / letters.length;
      const x = circleRadius + letterRadius * Math.cos((angle * Math.PI) / 180);
      const y = circleRadius + letterRadius * Math.sin((angle * Math.PI) / 180);

      if (letterRef) {
        letterRef.style.left = `${x - 72}px`;
        letterRef.style.top = `${y - 73}px`;
        letterRef.style.transform = `rotate(${angle}deg)`;
      }
    });
  };

  useEffect(() => {
    updateLetterPositions();
  }, [letters]);

  return (
    <div className="container" onMouseUp={handleMouseUp}>
      <div ref={redSquareRef} className="red-square">
        <svg ref={svgRef} className="svg-overlay">
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="black"
              strokeWidth="2"
            />
          ))}
          {isMouseDown && selectedLetters.length > 0 && currentMousePos && (
            <line
              x1={
                letterRefs.current[
                  letters.indexOf(selectedLetters[selectedLetters.length - 1])
                ].getBoundingClientRect().left +
                letterRefs.current[
                  letters.indexOf(selectedLetters[selectedLetters.length - 1])
                ].getBoundingClientRect().width /
                  2 -
                redSquareRef.current.getBoundingClientRect().left
              }
              y1={
                letterRefs.current[
                  letters.indexOf(selectedLetters[selectedLetters.length - 1])
                ].getBoundingClientRect().top +
                letterRefs.current[
                  letters.indexOf(selectedLetters[selectedLetters.length - 1])
                ].getBoundingClientRect().height /
                  2 -
                redSquareRef.current.getBoundingClientRect().top
              }
              x2={currentMousePos.x}
              y2={currentMousePos.y}
              stroke="black"
              strokeWidth="2"
            />
          )}
        </svg>

        <div
          ref={circleRef}
          className="circle"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {letters.map((letter, index) => {
            return (
              <div
                className={`letter ${
                  selectedLetters.includes(letter) ? "selected" : ""
                }`}
                key={index}
                ref={(el) => (letterRefs.current[index] = el)}
              >
                {letter}
              </div>
            );
          })}
        </div>

        <div className="word-display">{selectedLetters.join("")}</div>
      </div>
    </div>
  );
}

// Add PropTypes for validation
LetterCircle.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onWordChange: PropTypes.func.isRequired,
};

export default LetterCircle;
