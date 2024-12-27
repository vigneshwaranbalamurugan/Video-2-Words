import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload, faFileAlt, faExpand, faColumns,faPlay,faFilePdf,faFileExport,faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";import styles from '../styles/Mainworkflow.module.css';
import handleFileUploadRequest from "../apiRequests/handleFileUploadRequests";
import handleGetTranscriptRequest from "../apiRequests/handleGetTranscriptRequests";
import { enterFullScreen,exitFullScreen } from "../actions/fullScreenActions";
import UploadArea from "./uploadArea";
import SelectLanguage from "./selectLanguage";

const MainWorkflow = () => {

  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("Original transcript will appear here...");
  const [translatedTranscript, setTranslatedTranscript] = useState("Translated transcript will appear here...");
  const [viewMode, setViewMode] = useState("side-by-side"); 
  const [uploadedVideo, setUploadedVideo] = useState(null); 
  const [selectedLanguage,setselectedLanguage]=useState("");
  const [s3Key,sets3Key]=useState("");
  const [s3url,setS3url]=useState("");
  const [showOriginalTranscript,setShowOriginalTranscript]=useState(true);
  const [showTranslatedTranscript,setShowTranslatedTranscript]=useState(true);


  const handleFileUpload = async (e)=>{
     await handleFileUploadRequest(e,setUploadProgress,setUploadedVideo,setS3url,sets3Key);
  }

  const handleGetTranscript = async () =>{
     await handleGetTranscriptRequest(uploadProgress,s3Key,selectedLanguage,setOriginalTranscript,setTranslatedTranscript,setTranscriptionReady);
  }

  const handleReupload = () =>{
    setUploadProgress(0);
    setUploadedVideo(null);
    setVideo(null);
    setTranscriptionReady(false);
  }

  const handleEnterFullScreen = (element) =>{
    enterFullScreen(element,setViewMode);
  }

  const handleExitFullScreen = ()=>{
    exitFullScreen(setViewMode);
  }

  return (
    <div className={styles.workflow}>

     {!transcriptionReady && (   
        <div className={styles.twostep}>
      {/* Step 1: Video Upload */}
      <UploadArea uploadProgress={uploadProgress} uploadedVideo={uploadedVideo} handleFileUpload={handleFileUpload}/>

      {/* Step 2: Select Languages */}
      <SelectLanguage selectedLanguage={selectedLanguage} setselectedLanguage={setselectedLanguage} handleGetTranscript={handleGetTranscript} uploadProgress={uploadProgress}/>
     
    </div>
    )}

      {/* Step 3: Transcription Results */}
      {transcriptionReady && (
        <section id="transcriptionresult" className={`${styles.resultsstep} ${viewMode=="full-screen"?styles.resultstepfull:""}`}>
          <h2>Step 3: Transcription Results</h2>
          <div className={styles.viewmodetoggle}>
          <button
              className={`${styles.viewbutton} ${viewMode === "side-by-side" ? styles.viewactive : ""}`}
              onClick={handleExitFullScreen}>
              <FontAwesomeIcon icon={faColumns} style={{ marginRight: "8px" }} /> 
              Split View
            </button>
            
          <button
              className={`${styles.viewbutton} ${viewMode === "full-screen" ? styles.viewactive : ""}`}
              onClick={() => handleEnterFullScreen(document.getElementById("transcriptionresult"))}            >
              <FontAwesomeIcon icon={faExpand} style={{ marginRight: "8px" }} /> 
              Full Screen
            </button>
            
            {viewMode==="side-by-side" && (
            <>
            <button className={`${styles.viewbutton} ${styles.uploadbutton}`}>
              <FontAwesomeIcon icon={faCloudUpload} style={{ marginRight: "8px" }} />
              Upload Again
            </button>
            <button className={`${styles.viewbutton} ${styles.retransbutton}`} onClick={()=>{setTranscriptionReady(false)}}>
            <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "8px" }} />
              Transcript Again
              </button> 
              </>
             )}

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
          <div className={styles.showhidebutton }>
              <button className={`${styles.iconsbutton} `} title="Show or Hide" onClick={()=>{setShowOriginalTranscript(!showOriginalTranscript)}}>
              <i >             
                 <FontAwesomeIcon icon={showOriginalTranscript?faEye:faEyeSlash} /> 
              </i>
            </button> 
            </div>
          <h4>Original Transcript</h4>
          
          <div className={styles.actionsbuttons}>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttonplay}`} title="Play as Audio">
              <i >             
                 <FontAwesomeIcon icon={faPlay} /> 
              </i>
            </button>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttondownload}`} title="Download as PDF">
              <i > 
              <FontAwesomeIcon icon={faFilePdf} /> 
            </i>
            </button>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttonexport}`} title="Export as .SRT">
              <i >              
              <FontAwesomeIcon icon={faFileExport} /> 
              </i>
            </button>
        </div>
        {showOriginalTranscript && (
            <textarea
              className={`${styles.transcript} ${styles.original} ${showTranslatedTranscript?'':styles.originalTranscriptFull}`}
              value={originalTranscript}
              onChange={(e) => setOriginalTranscript(e.target.value)}
            />
        )}
          <div className={`${styles.showhidebutton} ${styles.transcript}` }>
          <button className={`${styles.iconsbutton} `} title="Show or Hide" onClick={()=>{setShowTranslatedTranscript(!showTranslatedTranscript)}}>
              <i >             
                 <FontAwesomeIcon icon={showTranslatedTranscript?faEye:faEyeSlash} /> 
              </i>
            </button> 
            <h4>Translated Transcript</h4>
            <div className={styles.actionsbuttons}>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttonplay}`} title="Play as Audio">
              <i >             
                 <FontAwesomeIcon icon={faPlay} /> 
              </i>
            </button>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttondownload}`} title="Download as PDF">
              <i > 
              <FontAwesomeIcon icon={faFilePdf} /> 
            </i>
            </button>
            <button className={`${styles.iconsbutton} ${styles.iconsbuttonexport}`} title="Export as .SRT">
              <i >              
              <FontAwesomeIcon icon={faFileExport} /> 
              </i>
            </button>
             </div>
            </div>
           
           {showTranslatedTranscript && ( <textarea
              className={`${styles.transcript} ${styles.translated} ${showOriginalTranscript?'':styles.originalTranscriptFull}`}
              value={translatedTranscript}
              onChange={(e) => setTranslatedTranscript(e.target.value)}
            />)}
          </div>
          </div>
        </section>
      )}
      {/* Step 4: Actions */}
      {/* {transcriptionReady && (
        <section className={styles.actionsstep}>
          <h2>Step 4: Actions</h2>
          <button className={`${styles.actionbutton} ${styles.playaudio}`}>Play Transcript Audio</button>
          <button className={`${styles.actionbutton} ${styles.downloadpdf}`}>Download PDF</button>
          <button className={`${styles.actionbutton} ${styles.exportsrt}`}>Export as Subtitle (.srt)</button>
        </section>
        
      )} */}

    </div>
  );
};false

export default MainWorkflow;
