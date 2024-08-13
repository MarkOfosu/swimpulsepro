import { TbBackground } from 'react-icons/tb';
import styles from '../styles/FeatureSection.module.css';
import Image, { StaticImageData } from 'next/image';

interface FeatureSectionProps {
  title: string;
  description: string;
  image: StaticImageData
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, image }) => {
  return (
    <section className={styles.featureSection}>
      <div className={styles.text}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.image} >
        <Image src={image} alt={title} width={500} height={500} />
      </div>
    </section>
  );
};

export default FeatureSection;
