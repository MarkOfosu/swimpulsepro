import styles from '../styles/Banner.module.css';
import Image from 'next/image';
import bannerImage from '../../public/image/banner4.png';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.gridContainer}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <h1 className={styles.title}>
            Connecting swimmers and coaches
              <span className={styles.titleSpan}>
                {/* Elevate Your Swim experience */}
                {/* Connecting swimmers and coaches */}
              </span>
            </h1>
            
            <p className={styles.description}>
              Transform your coaching journey with our innovative platform. 
              We empower coaches to unlock their swimmers full potential, 
              track progress effortlessly, and build championship-caliber athletes.
            </p>
            
           
          <Link href={"/getStarted"}>
            <button className={styles.ctaButton}>
              Get Started
            </button>        
          </Link>
          </div>
         

          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src={bannerImage}
                alt="Professional swim coach by the pool"
                className={styles.image}
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.purpleBlur} />
        <div className={styles.indigoBlur} />
      </div>
    </div>
  );
};

export default Banner;