import React from 'react';
import styles from '../styles/Footer.module.css';
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.legal}>
        <div className={styles.legalLinksContainer}>
          <ul className={styles.legalLinks}>
            <li className={styles.legalLinkItem}>
              <a href="#" className={styles.legalLink}>Terms of Service</a>
            </li>
            <li className={styles.legalLinkItem}>
              <a href="#" className={styles.legalLink}>Privacy Policy</a>
            </li>
            <li className={styles.legalLinkItem}>
              <a href="#" className={styles.legalLink}>Security</a>
            </li>
          </ul>
          <p className={styles.legalCopyright}>
            &copy; 2024 - Present SwimPulsePro Inc. All rights reserved.
          </p>
        </div>
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com" className={styles.socialLink}>
            <img src="/instagram-icon.png" alt="Instagram" className={styles.socialIcon} />
          </a>
          <a href="https://www.facebook.com" className={styles.socialLink}>
            <img src="/facebook-icon.png" alt="Facebook" className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;