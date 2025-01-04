import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload, faFileAlt, faColumns,faEye,faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import FullScreen from "@icons/fullscreen.png";
import ResultHead from "@icons/transcript.png";
import ActionsButtons from "@utils/actionButtons";
import styles from "@styles/Mainworkflow.module.css";

const TranscriptionResult =({
      viewMode,
      handleExitFullScreen,
      handleEnterFullScreen,
      handleAction,
      uploadedVideo,
      setShowOriginalTranscript,
      showOriginalTranscript,
      handleplayTextAsAudio,
      isPlaying,
      playingAudio,
      handleFileDownload,
      originalTranscript,
      transcriptRef,
      setShowTranslatedTranscript,
      showTranslatedTranscript,
      translatedTranscript,
      highlightedIndex,
      highlightedRef,
})=>{
    return(
    <section id="transcriptionresult" className={`${styles.resultsstep} ${viewMode=="full-screen"?styles.resultstepfull:""}`}>
        <h2>
            <Image src={ResultHead} className={styles.transcriptimage}/>
            Your Transcripts
        </h2>
        <div className={styles.viewmodetoggle}>

            {viewMode==="full-screen" && (  
                <button
                className={`${styles.viewbutton} ${ styles.viewactive}`}
                onClick={handleExitFullScreen}>
                <FontAwesomeIcon icon={faColumns} style={{ marginRight: "8px" }} /> 
                Exit Full Screen
                </button>
            )} 

            {viewMode==="side-by-side" && (  
                <button
                className={`${styles.viewbutton} ${styles.viewactive}`}
                onClick={() => handleEnterFullScreen(document.getElementById("transcriptionresult"))}            >
                <Image src={FullScreen} className={styles.viewsmodeImage} style={{ marginRight: "8px" }} /> 
                Full Screen
                </button>
            )} 

            {viewMode==="side-by-side" && (
            <>
                <button onClick={() => handleAction("reupload")} className={`${styles.viewbutton}  ${styles.uploadbutton}`}>
                <FontAwesomeIcon icon={faCloudUpload}  className={styles.viewsmodeImage} style={{ marginRight: "8px" }} />
                Upload Again
                </button>
                <button className={`${styles.viewbutton} ${styles.retransbutton}`} onClick={() => handleAction("retranscript")}>
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

                <ActionsButtons 
                handleplayTextAsAudio={handleplayTextAsAudio}
                TranscriptType={"original"}
                isPlaying={isPlaying}
                playingAudio={playingAudio}
                handleFileDownload={handleFileDownload}
                transcript={originalTranscript}
                />

                {showOriginalTranscript && (
                    <div
                    ref={transcriptRef}
                    className={`${styles.transcript} ${styles.translated} ${showTranslatedTranscript ? "" : styles.originalTranscriptFull}`}
                    >
                        {/* Original Transcript */}
                        {originalTranscript.split(" ").map((word, index) => (
                            <span
                            ref={index === highlightedIndex && playingAudio === "original" ? highlightedRef : null}
                            key={`original-${index}`}
                            className={index === highlightedIndex && playingAudio === "original" ? styles.highlight : ""}
                            >
                            {word}{" "}
                            </span>
                        ))}
                    </div>
                )}

                <div className={`${styles.showhidebutton} ${styles.transcripthead}` }>
                    <button className={`${styles.iconsbutton} `} title="Show or Hide" onClick={()=>{setShowTranslatedTranscript(!showTranslatedTranscript)}}>
                    <i >             
                    <FontAwesomeIcon icon={showTranslatedTranscript?faEye:faEyeSlash} /> 
                    </i>
                    </button> 
                    <h4>Translated Transcript</h4>
                    <ActionsButtons 
                    handleplayTextAsAudio={handleplayTextAsAudio}
                    TranscriptType={"translated"}
                    isPlaying={isPlaying}
                    playingAudio={playingAudio}
                    handleFileDownload={handleFileDownload}
                    transcript={translatedTranscript}
                    />
                </div>

                {showTranslatedTranscript && ( 
                    <div 
                    ref={transcriptRef} 
                    className={`${styles.transcript} ${styles.translated} ${showOriginalTranscript?'':styles.originalTranscriptFull}`}> 
                    {translatedTranscript.split(" ").map((word, index) => (
                        <span
                        ref={index === highlightedIndex && playingAudio === "translated" ? highlightedRef : null}
                        key={`translated-${index}`}
                        className={index === highlightedIndex && playingAudio === "translated" ? styles.highlight : ""}
                        >
                        {word}{" "}
                        </span>
                    ))}
                    </div>

                )}

            </div>
        </div>
    </section>
    );
};

export default TranscriptionResult;