import React, { useState, useEffect } from "react";

const Typewriter = ({
  text,
  speed = 100,
  deleteSpeed = 50,
  delay = 0,
  loop = false,
  pauseBeforeDelete = 2000,
  cursor = true,
  className = "",
  onComplete,
  hideCursorOnComplete = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;
    if (hasEnded) return;

    let ticker;
    
    const handleTyping = () => {
      const i = loopNum % (Array.isArray(text) ? text.length : 1);
      const fullText = Array.isArray(text) ? text[i] : text;

      if (isDeleting) {
        setDisplayedText((prev) => fullText.substring(0, prev.length - 1));
        setTypingSpeed(deleteSpeed);
      } else {
        setDisplayedText((prev) => fullText.substring(0, prev.length + 1));
        setTypingSpeed(speed);
      }

      if (!isDeleting && displayedText === fullText) {
        // Finished typing one phrase
        if (loop || (Array.isArray(text) && text.length > 1)) {
           // Wait before deleting
           setTypingSpeed(pauseBeforeDelete);
           setIsDeleting(true);
        } else {
          // Done completely
          setHasEnded(true);
          if (onComplete) onComplete();
        }
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Pause before next word
      }
    };

    ticker = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, loopNum, hasStarted, text, speed, deleteSpeed, pauseBeforeDelete, loop, hasEnded]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && !(hideCursorOnComplete && hasEnded) && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default Typewriter;
