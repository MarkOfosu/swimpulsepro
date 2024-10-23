import styles from '../styles/WelcomePage.module.css';

const ComingSoonFeatures = () => {
  return (
    <section className={styles.comingSoonSection}>
      <div className={styles.pulseCircle}></div>
      <div className={styles.pulseCircle}></div>
      <div className={styles.comingSoonContainer}>
        <h2 className={styles.comingSoonText}>Features Details</h2>
        <p className={styles.comingSoonDescription}>
          We&apos;re working on something exciting! Our comprehensive feature details will be available soon, 
          showcasing how SwimPulsePro will transform your coaching experience.
        </p>
      </div>
    </section>
  );
};

export default ComingSoonFeatures;