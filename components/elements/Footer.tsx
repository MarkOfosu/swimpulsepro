// components/Footer.tsx
import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>SwimPulsePro</h3>
            <p className={styles.companyDesc}>
              Empowering swimmers and coaches with innovative technology
            </p>
          </div>

          {/* Links Section */}
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Product</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Guide</a></li>
              </ul>
            </div>
            
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Company</h4>
              <ul className={styles.linkList}>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.socialSection}>
            <h4 className={styles.columnTitle}>Connect With Us</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.legalLinks}>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} SwimPulsePro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;