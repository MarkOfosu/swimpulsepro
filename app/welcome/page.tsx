import WelcomeNavbar from './WelcomeNavbar';
import Banner from './Banner';
import FeatureSection from './FeatureSection';
import Footer from '../../components/ui/Footer';
import styles from '../styles/WelcomePage.module.css';
import banner1 from '../../public/image/background1.jpeg';
import banner2 from '../../public/image/feature1.jpeg';
import feature1 from '../../public/image/banner2.jpeg';
import background2 from '../../public/image/background2.jpeg';

const WelcomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <WelcomeNavbar />
      <Banner />
      <FeatureSection
        title="Track Performance"
        description="Monitor swimmer's performance over time with detailed analytics."
        image={banner1}
      />
      <FeatureSection
        title="Set Goals"
        description="Help swimmers set and achieve their goals with personalized plans."
        image={banner2}
      />
      <FeatureSection
        title="Manage Teams"
        description="Easily manage multiple swimmers and teams from one dashboard."
        image={feature1}
      />
      <FeatureSection
        title="Analyze Data"
        description="Analyze crucial data, improve training and performance for swimmers."
        image={background2}
      />
      <Footer />
    </div>
  );
};

export default WelcomePage;
