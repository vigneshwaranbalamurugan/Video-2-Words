import React, { useState } from "react";
import Image from 'next/image'
import Upload from '../assests/upload.png';
import styles from '../styles/Mainworkflow.module.css';
import Languages from "./languages";

const MainWorkflow = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("Original transcript will appear here...");
  const [translatedTranscript, setTranslatedTranscript] = useState("Translated transcript will appear here...");
  const [viewMode, setViewMode] = useState("side-by-side"); // "side-by-side" or "full-screen"
  const [uploadedVideo, setUploadedVideo] = useState(null); // For storing video URL
  const [selectedLanguage,setselectedLanguage]=useState("");
  const [s3Key,sets3Key]=useState("");
  const [s3url,setS3url]=useState("");


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setUploadProgress(0); // Reset progress
  
    if (file) {
  
      // Create FormData object
      const formData = new FormData();
      formData.append("file", file);
      const videoURL = URL.createObjectURL(file);

      try {
        // Simulate progress for the UI while uploading
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval); // Stop interval when progress reaches 90%
              return prev;
            }
            return prev + 5; // Increment progress
          });
        }, 200); // Update progress every 200ms
  
        // Send the file to the backend
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
  
        clearInterval(interval); // Clear progress interval
  
        if (response.ok) {
          const data = await response.json();
          setUploadProgress(100); // Set progress to 100% on success
  
          // Generate and display the video URL
          setUploadedVideo(videoURL);
          setS3url(data.url);
          sets3Key(data.s3Key);

          // Display success response
          alert(`Upload successful: ${data.message}`);
        } else {
          // Handle error response
          const error = await response.json();
          setUploadProgress(0);
          alert(`Upload failed: ${error.message}`);
        }
      } catch (error) {
        setUploadProgress(0); // Reset progress on error
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading.");
      }
    }
  };
  

  const handleGetTranscript = async() =>{
    try {
        // Sending POST request to the backend
        const response = await fetch("http://localhost:5000/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            s3Key:s3Key,
            targetLanguage:selectedLanguage,
          }),
        });
  
        // Handling the response
        if (response.ok) {
          const data = await response.json(); // Assuming the response is JSON
          alert(data.message);
          setOriginalTranscript(data.originalTranscript);
          setTranslatedTranscript(data.translatedTranscript);
          setTranscriptionReady(true);
        } else {
          const errorData = await response.json(); // Assuming the error response is JSON
          console.log(errorData);
        alert(errorData.message);
        }
      } catch (err) {
        console.log(err);
        alert("Failed to connect to the server. Please try again.");
      } 
  }


  const handleReupload = () =>{
    setUploadProgress(0);
    setUploadedVideo(null);
    setVideo(null);
    setTranscriptionReady(false);
  }



  function enterFullScreen(element) {
    setViewMode("full-screen");
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // For Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // For IE/Edge
      element.msRequestFullscreen();
    }
  }

  const exitFullScreen = () => {
    console.log("Exiting fullscreen...");
    setViewMode("side-by-side");
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // For Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // For Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // For IE/Edge
      document.msExitFullscreen();
    }
  };

  return (
    <div className={styles.workflow}>
     {!transcriptionReady && (   
        <div className={styles.twostep}>
      {/* Step 1: Video Upload */}
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
          <h3>Preview:</h3>
          <video controls width="100%">
            <source src={uploadedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <center>
            <button className={`${styles.actionbutton}`} onClick={handleReupload}>Re-Upload</button>
         </center>
        </div>

      )}
    </section>


      {/* Step 2: Select Languages */}
     
      <section className={styles.languagestep}>
  <h2>Step 2: Select Language</h2>
  <p style={{ fontSize: "1.2rem", color: "#6B7280", marginBottom: "1rem" }}>
    Choose your preferred target language to generate accurate and seamless transcripts for your video. 
    Make sure to pick the one that suits your audience best!
  </p>
  <div className={styles.languageselection}>
    <label>
    Choose Language:
      <select
        value={selectedLanguage}
        onChange={(e) => {
          setselectedLanguage(e.target.value);
        }}
      >
              {Languages[0] && 
          Object.entries(Languages[0]).map(([name, code]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}

      </select>
    </label>
    <button
      className={`${styles.actionbutton} ${styles.gettranscript}`}
      onClick={handleGetTranscript}
    >
      Get Transcript
    </button>
  </div>
</section>

    
    </div>
    )}

      {/* Step 3: Transcription Results */}
      {transcriptionReady && (
        <section id="transcriptionresult" className={`${styles.resultsstep} ${viewMode=="full-screen"?styles.resultstepfull:""}`}>
          <h2>Step 3: Transcription Results</h2>
          <div className={styles.viewmodetoggle}>
          <button
              className={`${styles.viewbutton} ${viewMode === styles.fullscreen ? styles.active : ""}`}
              onClick={() => enterFullScreen(document.getElementById("transcriptionresult"))}            >

              Full-Screen View
            </button>
            <button
              className={`${styles.viewbutton} ${viewMode === styles.sidebyside ? styles.active : ""}`}
              onClick={exitFullScreen}>

              Side-by-Side View
            </button>
            
          </div>
          <div className={styles.resultflex}>
          <div
            className={styles.resultpreviewarea}>
            <div className={styles.resultvideopreview}>
             <video controls width="100%">
            <source src={uploadedVideo} type="video/mp4" />
          </video>
        </div>
       
        </div>
          
          <div className={`${styles.transcripts} ${viewMode}`}>
          <h4>Original Transcript</h4>
            <textarea
              className={`${styles.transcript} ${styles.original}`}
              value={originalTranscript}
              onChange={(e) => setOriginalTranscript(e.target.value)}
            />
            <h4>Translated Transcript</h4>

            <textarea
              className={`${styles.transcript} ${styles.translated}`}
              value={translatedTranscript}
              onChange={(e) => setTranslatedTranscript(e.target.value)}
            />
          </div>
          </div>
        </section>
      )}
      {/* Step 4: Actions */}
      {transcriptionReady && (
        <section className={styles.actionsstep}>
          <h2>Step 4: Actions</h2>
          <button className={`${styles.actionbutton} ${styles.playaudio}`}>Play Transcript Audio</button>
          <button className={`${styles.actionbutton} ${styles.downloadpdf}`}>Download PDF</button>
          <button className={`${styles.actionbutton} ${styles.exportsrt}`}>Export as Subtitle (.srt)</button>
        </section>
      )}
    </div>
  );
};

export default MainWorkflow;
