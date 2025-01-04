import React, { useState } from 'react';
import styles from '@styles/FileNameModal.module.css';

const FileNameModal = ({ heading, onSubmit, onCancel }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFileName(e.target.value);
    setError(""); 
  };

  const handleSubmit = () => {
    if (fileName.trim() === "") {
      setError("⚠️ Filename cannot be empty.");
    } else {
      onSubmit(fileName.trim());
    }
  };

  return (
    <div className={styles.fileoverlay}>
      <div className={styles.filemodal}>
        <h2 className={styles.fileheading}>{heading || "Enter File Name"}</h2>
        <input
          type="text"
          className={styles.fileinput}
          value={fileName}
          onChange={handleInputChange}
          placeholder="Type the file name here..."
          autoFocus
        />
        {error && <p className={styles.fileerror}>{error}</p>}
        <div className={styles.filebuttons}>
          <button className={styles.filecancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.filesubmitButton} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileNameModal;
