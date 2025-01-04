import React, { useEffect } from "react";
import styles from  "@styles/Toaster.module.css";


const Toast = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          onClose(); 
        }, 5000);
  
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose]);
  
    return (
      <div
        className={`${styles.toastContainer} ${isVisible ? styles.show : ""} ${
          styles[type]
        }`}
      >
        <div className={styles.toastIcon}>
          {type === "success" && "✅"}
          {type === "error" && "⛔"}
          {type === "warn" && "⚠️"}
          {type === "info" && "🛈"}
        </div>
        <div className={styles.toastMessage}>{message}</div>
      </div>
    );
  };
  
  export default Toast;