import React from "react";
import styles from '../styles/Home.module.css'
import Image from "next/image";
import multiLingual from "../assests/multilingual.png";
import pdf from "../assests/pdf.png";
import speech from "../assests/speaker.png";

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.herocontent}>
          <h1 className={styles.herotitle}>
            Upload Your Video, Get Instant Transcriptions and Translations in Any Language!
          </h1>
          <button className={styles.ctabutton}>Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureitem}>
          <i className={styles.featureicon}>
            <Image src={multiLingual} className={styles.featureicons}/>
          </i>
          <h3>Multilingual Support</h3>
          <p>Translate your videos into multiple languages easily.</p>
        </div>
        <div className={styles.featureitem}>
          <i className={styles.featureicon}>
          <Image src={pdf} className={styles.featureicons}/>

          </i>
          <h3>Download as PDF</h3>
          <p>Get a downloadable PDF of the transcribed text.</p>
        </div>
        <div className={styles.featureitem}>
          <i className={styles.featureicon}>
          <Image src={speech} className={styles.featureicons}/>
          </i>
          <h3>Text-to-Speech</h3>
          <p>Listen to your transcriptions directly on the site.</p>
        </div>
      </section>

    </div>
  );
};

export default Homepage;
