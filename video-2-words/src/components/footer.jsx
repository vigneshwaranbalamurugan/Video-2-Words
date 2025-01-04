import React from "react";
import styles from "@styles/Footer.module.css"; 
import Image from "next/image";
import Heart from "@icons/heart.png";

const FooterComponent = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          Designed & Developed with <span><Image src={Heart} className={styles.heart}/></span> by{" "}
          <a
            href="https://github.com/vigneshwaranbalamurugan"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vigneshwaran Balamurugan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
