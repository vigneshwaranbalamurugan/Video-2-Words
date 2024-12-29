import React, { useEffect } from "react";
import Image from 'next/image'
import Logo from "../assests/video2words.png";
import styles from "../styles/Launcher.module.css";

const Launcher = ({progress,setProgress}) => {

  // Simulate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 40); 
    if (progress === 100) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [progress]);

  const skipLauncher = () => {
    setProgress(100);
  };

  return (
    <div className={styles.launcher}>
      {/* Background Animation */}
      <div className={styles.background}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      <div className={styles.content}>
        {/* Logo and Website Name */}
        <div className={styles.logo}>
            <Image src={Logo} className={styles.launcherLogo}/>
        </div>
        <h1 className={styles.websiteName}>
        <span>Video</span> <span className={styles.to}>2</span> <span>Words</span>
        </h1>
        {/* Tagline Animation */}
        <p className={styles.tagline}>
          <span>Transforming</span> <span>videos</span> <span>into</span>{" "}
          <span>words</span> <span>effortlessly...</span>
        </p>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={styles.progressText}>Loading {progress}%</p>

        {/* Rotating Quotes */}
        <div className={styles.quotes}>
          <p className={styles.quote}>
            "Every video tells a story. Let's turn it into words."
          </p>
          <p className={styles.quote}>
          "Upload videos and get accurate transcripts in seconds!"
         </p>
        </div>

        {/* Skip Button */}
        <button className={styles.skipButton} onClick={skipLauncher}>
          Skip Launcher
        </button>
      </div>
    </div>
  );
};

export default Launcher;
