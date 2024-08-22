import styles from '../styles/WelcomeNavbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image/logo.png';

const WelcomeNavbar: React.FC = () => {
  return (
    <nav className={styles.welcomeNavbar}>
      <div className={styles.logo}>
        <Link href='/'><Image src={logo} alt="SwimPulsePro Logo" width={50} height={50} /></Link>
      </div>
      <div className={styles.welcomeNavLinksContainer}>
        <ul className={styles.welcomeNavLinks}>
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/features">Features</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default WelcomeNavbar;
