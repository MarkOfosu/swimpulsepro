// import WelcomeNavbar from './WelcomeNavbar';
// import Banner from './Banner';
// import FeatureSection from './FeatureSection';
// import Footer from '../../components/ui/Footer';
// import styles from '../styles/WelcomePage.module.css';
// import banner1 from '../../public/image/background1.jpeg';
// import banner2 from '../../public/image/feature1.jpeg';
// import feature1 from '../../public/image/banner2.jpeg';
// import background2 from '../../public/image/background2.jpeg';


// const WelcomePage: React.FC = () => {
//   return (
//     <div className={styles.container}>
//       <WelcomeNavbar />
//       <Banner />
//       <FeatureSection
//         title="Track Performance"
//         description="Monitor swimmer's performance over time with detailed analytics."
//         image={banner1}
//       />
//       <FeatureSection
//         title="Set Goals"
//         description="Help swimmers set and achieve their goals with personalized plans."
//         image={banner2}
//       />
//       <FeatureSection
//         title="Manage Teams"
//         description="Easily manage multiple swimmers and teams from one dashboard."
//         image={feature1}
//       />
//       <FeatureSection
//         title="Analyze Data"
//         description="Analyze crucial data, improve training and performance for swimmers."
//         image={background2}
//       />
//       <Footer />
//     </div>
//   );
// };

// export default WelcomePage;
import React from 'react';
import Image from 'next/image';
import WelcomeNavbar from './WelcomeNavbar';
import styles from '../styles/WelcomePage.module.css';

// Importing images
import homeBanner from '../../public/image/featureImages/homebBanner1.png';
import createGroup from '../../public/image/featureImages/createGroup.png';
import communicate from '../../public/image/featureImages/communicate.png';
import performanceCollection from '../../public/image/featureImages/performaceCollection.png';
import swimGroup from '../../public/image/featureImages/swimGroup.png';
import workout from '../../public/image/featureImages/workout.png';
import swimmerProfile from '../../public/image/featureImages/swimmerProfile.png';
import bestTimes from '../../public/image/featureImages/bestTimes.png';
import trackProgress from '../../public/image/featureImages/trackProgress.png';
import injuryLog from '../../public/image/featureImages/injuryLog.png';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <WelcomeNavbar />

      {/* Home Banner */}
      <div className={styles.imageSection}>
        <Image
          src={homeBanner}
          alt="Home Banner"
          className={styles.image}
          layout="responsive"
          priority
        />
      </div>

      {/* Features Section */}
      <div className={styles.featureContainer}>
        <div className={styles.feature}>
          <Image
            src={createGroup}
            alt="Create Group"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Create and manage swim groups with ease.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={communicate}
            alt="Communicate"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Communicate with swimmers and parents.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={performanceCollection}
            alt="Performance Collection"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Collect and analyze swimmer performance data.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={swimGroup}
            alt="Swim Group"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Manage swim groups and track progress.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={workout}
            alt="Workout"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Create and assign workouts to swimmers.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={swimmerProfile}
            alt="Swimmer Profile"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>View and manage swimmer profiles.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={bestTimes}
            alt="Best Times"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Track and manage swimmer best times.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={trackProgress}
            alt="Track Progress"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Track swimmer progress and performance.</p>
        </div>
        <div className={styles.feature}>
          <Image
            src={injuryLog}
            alt="Injury Log"
            className={styles.featureImage}
            layout="responsive"
          />
          <p>Record and manage swimmer injuries.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
