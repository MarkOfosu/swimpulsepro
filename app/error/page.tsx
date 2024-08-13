// pages/error.tsx (or app/error/page.tsx)

import React from 'react';
import Link from 'next/link';
import styles from '../styles/ErrorPage.module.css'; // Create a CSS module for styling

const ErrorPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Oops! Something went wrong.</h1>
      <p className={styles.description}>
        We encountered an error processing your request. Please try again later.
      </p>
      <Link href="/" className={styles.homeLink}>
        Go back to the homepage
      </Link>
    </div>
  );
}

export default ErrorPage;
