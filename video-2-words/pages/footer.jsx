import React from "react";
import styles from "../styles/Footer.module.css"; // Make sure to import CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          Developed with <span className={styles.heart}>❤️</span> by{" "}
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

export default Footer;
