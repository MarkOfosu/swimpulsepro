// components/Loader.tsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Loader.module.css';

interface LoaderProps {
  messages?: string[];
}

const Loader: React.FC<LoaderProps> = ({ messages = ["Getting things ready...", "Hang tight, almost there...", "Just a few more seconds!"] }) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [waveClass, setWaveClass] = useState(styles.waveAnimation);

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setCurrentMessage(messages[messageIndex]);
    }, 2000); // Change message every 2 seconds

    // Add some bounce effect every few seconds for fun
    const bounceTimeout = setTimeout(() => {
      setWaveClass(`${styles.waveAnimation} ${styles.bounce}`);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(bounceTimeout);
    };
  }, [messages]);

  return (
    <div className={styles.loaderContainer}>
      <div className={waveClass}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>
      <p className={styles.message}>{currentMessage}</p>
    </div>
  );
};

export default Loader;
