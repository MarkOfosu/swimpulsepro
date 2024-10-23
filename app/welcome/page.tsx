
import React from 'react';
import Image from 'next/image';
import WelcomeNavbar from './WelcomeNavbar';
import styles from '../styles/WelcomePage.module.css';
import Banner from './Banner';
import ComingSoonFeatures from './ComingSoonSection';
import Footer from '@components/elements/Footer';

const WelcomePage = () => {
  return (
    <>
    <div className={styles.container}>
      
      <WelcomeNavbar />

      <Banner />
      {/* Features Section */}
      {/* <div className={styles.featureContainer}> */}
      
      {/* </div> */}
      <ComingSoonFeatures />
    </div>
    <Footer />
    </>
  );
};

export default WelcomePage;
