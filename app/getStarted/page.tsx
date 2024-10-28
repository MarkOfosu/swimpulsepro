'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import { ArrowRight } from 'lucide-react';
import styles from '../styles/GetStarted.module.css';
import Footer from '@components/elements/Footer';

const GetStartedPage = () => {
  const router = useRouter();

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Get Started with SwimPulsePro</h1>
          <p className={styles.pageSubtitle}>
            Choose your path to begin your swimming journey
          </p>

          <div className={styles.roleCardsGrid}>
            {/* Coach Card */}
            <div 
              className={styles.roleCard}
              onClick={() => router.push('/auth/signup/coach')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  router.push('/auth/signup/coach');
                }
              }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardIconWrapper}>
                  <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M20 12V8H4V12M20 12V16H4V12M20 12H4M12 4V8M12 16V20" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>I&apos;m a Coach</h2>
                <p className={styles.cardDescription}>
                  Create and manage swim teams, track athlete progress, and elevate your coaching experience
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.footerText}>Register as Coach</span>
                  <ArrowRight className={styles.arrowIcon} size={20} />
                </div>
              </div>
            </div>

            {/* Swimmer Card */}
            <div 
              className={styles.roleCard}
              onClick={() => router.push('/auth/signup/swimmer')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  router.push('/auth/signup/swimmer');
                }
              }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardIconWrapper}>
                  <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 15C5.5 14.5 6.5 14 7.5 14C8.5 14 9 14.5 9.5 15" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>I&apos;m a Swimmer</h2>
                <p className={styles.cardDescription}>
                  Join your team, track your progress, and connect with your coach to achieve your swimming goals
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.footerText}>Register as Swimmer</span>
                  <ArrowRight className={styles.arrowIcon} size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>Why Choose SwimPulsePro?</h3>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureCheck}>✓</div>
                <span>Real-time progress tracking</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureCheck}>✓</div>
                <span>Team management tools</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureCheck}>✓</div>
                <span>Performance analytics</span>
              </div>
            </div>
          </div>
        </div>
      
      </div>
      <Footer />
    </>
  );
};

export default GetStartedPage;