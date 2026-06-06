import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rawNameCharacters = Array.from("RHINE TAGUE");
const nameCharacters = rawNameCharacters.map((character, index) => ({
  character,
  key: `${character}-${index}`,
  order: character === " "
    ? -1
    : rawNameCharacters.slice(0, index + 1).filter((item) => item !== " ").length - 1,
}));

const IntroAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyOverscroll = bodyStyle.overscrollBehavior;
    const previousHtmlOverflow = htmlStyle.overflow;
    const previousHtmlOverscroll = htmlStyle.overscrollBehavior;

    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    bodyStyle.overscrollBehavior = "none";
    htmlStyle.overflow = "hidden";
    htmlStyle.overscrollBehavior = "none";

    return () => {
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.overscrollBehavior = previousBodyOverscroll;
      htmlStyle.overflow = previousHtmlOverflow;
      htmlStyle.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const increment = 2;
    const intervalTime = 30;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 540);
          return 100;
        }

        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isExiting) return undefined;

    const exitTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 980);

    return () => clearTimeout(exitTimer);
  }, [isExiting, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] },
          }}
          className="intro-loader"
          aria-label="Loading Rhine Tague portfolio"
          role="status"
        >
          <div className="intro-loader-grain" aria-hidden="true" />
          <div className="intro-loader-ambient" aria-hidden="true" />
          <div className="intro-loader-circuit" aria-hidden="true" />

          <motion.div
            className="intro-loader-mark"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.12 }}
          >
            <div className="intro-loader-name" aria-label="Rhine Tague">
              {nameCharacters.map(({ character, key, order }) => (
                <motion.span
                  key={key}
                  className={character === " " ? "intro-loader-space" : "intro-loader-letter"}
                  style={{ "--letter-index": order }}
                  initial={{ opacity: character === " " ? 1 : 0.14, y: character === " " ? 0 : 5, filter: "blur(2px)" }}
                  animate={{ opacity: character === " " ? 1 : [0.18, 1, 0.62, 0.9], y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: character === " " ? 0.01 : 0.86,
                    delay: character === " " ? 0 : 0.2 + order * 0.095,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {character === " " ? "\u00A0" : character}
                </motion.span>
              ))}
            </div>

            <motion.div
              className="intro-loader-light-sweep"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 0.84, 0] }}
              transition={{ duration: 1.55, delay: 0.34, ease: [0.76, 0, 0.24, 1] }}
              aria-hidden="true"
            />

            <motion.div
              className="intro-loader-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.48, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{progress < 52 ? "Developer" : "Photographer"}</span>
              <span>{progress}%</span>
            </motion.div>

            <div className="intro-loader-track" aria-hidden="true">
              <motion.div
                className="intro-loader-progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
