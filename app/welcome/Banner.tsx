import styles from '../styles/Banner.module.css';
import Image from 'next/image';
import backgroundImage from '../../public/image/banner1.jpeg';

const Banner: React.FC = () => {
  return (
    <section className={styles.banner}>
      <Image
        src={backgroundImage}
        alt="Background Image"
        layout="fill"
        className={styles.backgroundImage}
      />
      <div className={styles.bannerContent}>
        <h1>Welcome to SwimPulsePro</h1>
        <p>Revolutionizing Swim Training and Performance Tracking</p>
        <button className={styles.ctaButton}>Get Started</button>
      </div>
    </section>
  );
};

export default Banner;
