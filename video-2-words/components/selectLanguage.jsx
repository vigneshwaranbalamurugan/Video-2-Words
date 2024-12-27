import React from "react";
import Languages from "../utils/languages";
import styles from '../styles/Mainworkflow.module.css';

const SelectLanguage = ({selectedLanguage,setselectedLanguage,handleGetTranscript,uploadProgress}) =>{
    return (
        <>
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
                className={`${styles.actionbutton} ${uploadProgress!==100 ?styles.buttoninactive:""} ${styles.gettranscript}`}
                onClick={handleGetTranscript}
                >
                Generate Transcript
                </button>
            </div>
            </section>
        </>
    );
};

export default SelectLanguage;