import React, { useState, useEffect } from "react";
import styles from "@styles/Loader.module.css"; // Import the CSS module

const Loader = () => {
    const states = ["Initializing...", "Processing Audio...", "Transcripting...","Translating...","Finalizing..."];
    const [currentStateIndex, setCurrentStateIndex] = useState(0);
  
    useEffect(() => {
      if (currentStateIndex < states.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStateIndex((prevIndex) => prevIndex + 1);
        }, 5*1000); 
        return () => clearTimeout(timer);
      }
    }, [currentStateIndex]);
  
    return (
      <div className={styles.loaderOverlay}>
        <div className={styles.loaderContainer}>
          {/* Glowing animated rings */}
          <div className={styles.glowRing}></div>
          <div className={styles.glowRing}></div>
          <div className={styles.glowRing}></div>
          
          {/* Central dot */}
          <div className={styles.centerDot}></div>
  
          {/* Loader Text */}
          <div className={styles.loaderText}>{states[currentStateIndex]}</div>
        </div>
      </div>
  );
};

export default Loader;
