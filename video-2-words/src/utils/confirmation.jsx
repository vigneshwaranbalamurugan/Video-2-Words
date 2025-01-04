import React, { useState } from 'react';
import styles from '@styles/Confirmation.module.css';

const Confirmation = ({ message, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleYes = () => {
    onConfirm(true); 
    setIsVisible(false); 
  };

  const handleNo = () => {
    onConfirm(false);
    setIsVisible(false); 
  };

  return (
    <>
      {isVisible && (
        <div className={styles.overlay}>
          <div className={styles.confirmationBox}>
            <div className={styles.confirmationTitle}>Confirm Action</div>
            <div className={styles.confirmationMessage}>{message}</div>
            <div className={styles.buttonContainer}>
              <button className={styles.confirmationButtonYes} onClick={handleYes}>
                Yes
              </button>
              <button className={styles.confirmationButtonNo} onClick={handleNo}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Confirmation;
