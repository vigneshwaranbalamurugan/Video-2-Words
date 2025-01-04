import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay,faFilePdf,faStop} from "@fortawesome/free-solid-svg-icons";
import Export from "@icons/export.png";
import styles from "@styles/Mainworkflow.module.css";

const ActionsButtons = ({
    handleplayTextAsAudio,
    TranscriptType,
    isPlaying,
    playingAudio,
    handleFileDownload,
    transcript
}) =>{
   return(
    <div className={styles.actionsbuttons}>
        <button className={`${styles.iconsbutton} ${styles.iconsbuttonplay}`}  onClick={() => handleplayTextAsAudio(TranscriptType)}
        title={isPlaying && playingAudio === TranscriptType? "Pause Audio" : "Play Audio"}>
        <i >             
        <FontAwesomeIcon icon={isPlaying && playingAudio === TranscriptType ? faStop : faPlay} />              </i>
        </button>
        <button className={`${styles.iconsbutton} ${styles.iconsbuttondownload}`} onClick={()=>{handleFileDownload("pdf",transcript);}} title="Download as PDF">
        <i > 
        <FontAwesomeIcon icon={faFilePdf} /> 
        </i>
        </button>
        <button className={`${styles.iconsbutton} ${styles.iconsbuttonexport}`} onClick={()=>{handleFileDownload("srt",transcript)}} title="Export as .SRT">
        <i >              
        <Image src={Export} className={styles.actionsicons} /> 
        </i>
        </button>
   </div>
   );

};

export default ActionsButtons;