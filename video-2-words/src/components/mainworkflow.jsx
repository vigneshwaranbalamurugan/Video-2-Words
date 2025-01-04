import React, { useState,useRef, useEffect } from "react";
import styles from '@styles/Mainworkflow.module.css';
import handleFileUploadRequest from "@apirequest/handleFileUploadRequests";
import handleGetTranscriptRequest from "@apirequest/handleGetTranscriptRequests";
import { enterFullScreen,exitFullScreen } from "@actions/fullScreenActions";
import { handleDownload } from "@actions/generateSrt";
import { generatePDF } from "@actions/generatepdf";
import Loader from "@utils/loader";
import UploadAreaComponent from "@components/uploadArea";
import SelectLanguageComponent from "@components/selectLanguage";
import Confetti from "@utils/confetti";
import Toast from "@utils/toaster";
import Confirmation from "@utils/confirmation";
import FileNameModal from "@utils/fileName";
import { playTextAsAudio } from "@actions/playTextAsAudio";
import { handleConfirmationAction } from "@actions/confirmAction";
import TranscriptionResult from "@components/transcriptionResult";

const MainWorkflowComponent = () => {

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [isLoading,setIsLoading]=useState(false);
  const [isConfetti,setIsConfetti]=useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null); 
  const [s3Key,sets3Key]=useState("");
  const [s3url,setS3url]=useState("");
  const [selectedLanguage,setselectedLanguage]=useState("");
  const [detectedLanguage,setdetectedLanguage]=useState("");
  const [transcriptionReady, setTranscriptionReady] = useState(true);
  const [originalTranscript, setOriginalTranscript] = useState("Original transcript will appear here...");
  const [translatedTranscript, setTranslatedTranscript] = useState("Translated transcript will appear here...");
  const [viewMode, setViewMode] = useState("side-by-side"); 
  const [showOriginalTranscript,setShowOriginalTranscript]=useState(true);
  const [showTranslatedTranscript,setShowTranslatedTranscript]=useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingAudio,setPlayingAudio]=useState("none");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [actionType, setActionType] = useState("");
  const [downloadContent,setDownloadContent]=useState("");


   
  const transcriptRef = useRef(null); 
  const highlightedRef = useRef(null); 
  const utteranceRef = useRef(null); 
  const timeoutsRef = useRef([]);



    useEffect(() => {
      if (highlightedRef.current) {
        highlightedRef.current.scrollIntoView({
          behavior: "smooth", 
          block: "center", 
          inline: "nearest", 
        });
      }
    }, [highlightedIndex]); 


    useEffect(() => {
      if (transcriptionReady) {
        const timer = setTimeout(() => {
          setIsConfetti(false); 
        }, 1000);

        return () => clearTimeout(timer); 
      }
    }, [transcriptionReady]);



    const showToast = (message, type) => {
      setToast({ isVisible: true, message, type });

      setTimeout(() => {
        setToast({ ...toast,isVisible: false, message:"",type:"" });
      }, 5000);
    };


    const handleplayTextAsAudio = (type) =>{

      playTextAsAudio(
        type,
        originalTranscript,
        translatedTranscript,
        setShowOriginalTranscript,
        setShowTranslatedTranscript,
        isPlaying,
        playingAudio,
        utteranceRef,
        detectedLanguage,
        selectedLanguage,
        setHighlightedIndex,
        setIsPlaying,
        setPlayingAudio,
        timeoutsRef
      )
    }

  
    const handleFileUpload = async (e)=>{
      await handleFileUploadRequest(
        e,
        setUploadProgress,
        setUploadedVideo,
        setS3url,
        sets3Key,
        showToast
      );
  }

  const handleGetTranscript = async () =>{
    setIsLoading(true);
      await handleGetTranscriptRequest(
      uploadProgress,
      s3Key,
      selectedLanguage,
      setOriginalTranscript,
      setTranslatedTranscript,
      setTranscriptionReady,
      setdetectedLanguage,
      showToast
    );
    setIsLoading(false);
  }

  const handleAction = (type) => {
    setActionType(type); 
    setConfirmationVisible(true); 
    };

    const handleConfirmation= (isConfirmed)=>{
      handleConfirmationAction(
        isConfirmed,
        setUserConfirmed,
        setConfirmationVisible,
        actionType,
        setTranscriptionReady,
        showToast,
        setUploadProgress,
        setUploadedVideo,
        setActionType
      );
    }

    const handleModalCancel = () => {
      setActionType("");
      setDownloadContent("");
      setIsModalVisible(false);
      showToast("Action canceled", "warn");
    };

    const handleModalSubmit = (fileName) => {
      setIsModalVisible(false); 
      if(actionType=="srt")
      handleDownload(fileName, downloadContent,showToast); 
      else 
      generatePDF(downloadContent,fileName,showToast);
    };

    const handleFileDownload = (action,content) => {
      setDownloadContent(content);
      setActionType(action);
      setIsModalVisible(true);
    };
    

    const handleEnterFullScreen = (element) =>{
      enterFullScreen(element,setViewMode);
    }

    const handleExitFullScreen = ()=>{
      exitFullScreen(setViewMode);
    }

  return (
    <div className={styles.workflow}>

        {isLoading &&!transcriptionReady && <Loader/>}

        {confirmationVisible && (
          <Confirmation
          message={`Are you sure you want to ${actionType === "retranscript" ? "start the transcription again?" : "re-upload?"}`}         
          onConfirm={handleConfirmation}
          />
        )}

        {isModalVisible && (
          <FileNameModal
            heading={`Enter File Name to Save Subtitle as ${actionType}`}
            onSubmit={handleModalSubmit}
            onCancel={handleModalCancel}
          />
        )}

        <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        />


        {!transcriptionReady && (   
            <div className={styles.twostep}>

          {/* Step 1: Video Upload */}
          <UploadAreaComponent 
          uploadProgress={uploadProgress} 
          uploadedVideo={uploadedVideo} 
          handleFileUpload={handleFileUpload} 
          />

          {/* Step 2: Select Languages */}
          <SelectLanguageComponent 
          selectedLanguage={selectedLanguage} 
          setselectedLanguage={setselectedLanguage} 
          handleGetTranscript={handleGetTranscript} 
          uploadProgress={uploadProgress}
          />
        
        </div>
        )}
  

        {transcriptionReady && <Confetti isVisible={isConfetti}/>}

      {/* Step 3: Transcription Results */}
      {transcriptionReady && (
        <TranscriptionResult
          viewMode={viewMode}
          handleExitFullScreen={handleExitFullScreen}
          handleEnterFullScreen={handleEnterFullScreen}
          handleAction={handleAction}
          uploadedVideo={uploadedVideo}
          setShowOriginalTranscript={setShowOriginalTranscript}
          showOriginalTranscript={showOriginalTranscript}
          handleplayTextAsAudio={handleplayTextAsAudio}
          isPlaying={isPlaying}
          playingAudio={playingAudio}
          handleFileDownload={handleFileDownload}
          originalTranscript={originalTranscript}
          transcriptRef={transcriptRef}
          setShowTranslatedTranscript={setShowTranslatedTranscript}
          showTranslatedTranscript={showTranslatedTranscript}
          translatedTranscript={translatedTranscript}
          highlightedIndex={highlightedIndex}
          highlightedRef={highlightedRef}
        />
      )}
  
      </div>
  );
};false

export default MainWorkflowComponent;
