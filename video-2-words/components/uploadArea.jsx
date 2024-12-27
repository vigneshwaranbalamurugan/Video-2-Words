import React from "react";
import Image from 'next/image'
import Upload from '../assests/upload.png';
import styles from '../styles/Mainworkflow.module.css';

const UploadArea = ({uploadedVideo,uploadProgress,handleFileUpload}) =>{
    return(
        <>
            <section className={styles.uploadstep}>
                <h2>Step 1: Video Upload</h2>
                { (!uploadedVideo || uploadProgress <100) && (
                <div
                    className={styles.uploadarea}
                    onClick={() => document.getElementById("video-upload-input").click()}
                >
                    
                    <Image src={Upload} alt="Upload Icon" className={styles.uploadicon} />   
                    {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressLabel}>
                        {`Uploading... ${uploadProgress}%`}
                        </div>
                        <div className={styles.progressbar}>
                        <div
                            className={styles.progress}
                            style={{ width: `${uploadProgress}%` }}
                        />
                        </div>
                    </div>
                    )}
                    Drag and drop your video here or{" "}
                    <span className={styles.uploadlink}>click to upload</span>.
                <p className={styles.uploadinfo}>Supported formats: MP4, AVI. Max size: 100MB</p>
                <input
                    type="file"
                    id="video-upload-input"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
                    </div>

                )}
                
                {uploadedVideo && uploadProgress === 100 && (
                    <div
                        className={styles.previewarea}>
                    <div className={styles.videopreview}>
                    {/* <h3>Preview:</h3> */}
                    <video controls width="100%">
                        <source src={uploadedVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>
                    {/* <center>
                        <button className={`${styles.actionbutton}`} onClick={handleReupload}>Re-Upload</button>
                    </center> */}
                    </div>
                )}
    </section>
        </>
    );
};

export default UploadArea;