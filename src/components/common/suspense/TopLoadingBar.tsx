import React, { useState, useEffect } from "react";

const TopLoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          return prevProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 90);
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    return () => {
      setProgress(100);
      setTimeout(() => setVisible(false), 500);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        backgroundColor: "rgba(255,255,255,0.2)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "#E0B643",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default TopLoadingBar;
