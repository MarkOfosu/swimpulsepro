// ContentRootLayoutLoading.tsx
'use client';
import React from 'react';
import styles from '../styles/ContentRootLayoutLoading.module.css';

const ContentRootLayoutLoading = () => {
  return (
    <div className={styles.loadingLayout}>
      {/* Collapsible Nav Skeleton */}
      <div className={styles.collapsibleNavSkeleton}>
        <div className={styles.logoSkeleton} />
        <div className={styles.navItemsSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.navItemSkeleton} />
          ))}
        </div>
        <div className={styles.profileSkeleton} />
      </div>

      {/* Content Nav Bar Skeleton */}
      <div className={styles.contentNavSkeleton}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.navLinkSkeleton} />
        ))}
      </div>

      <div className={styles.contentMain}>
        {/* Sidebar Skeleton */}
        <div className={styles.sidebarSkeleton}>
          <div className={styles.sidebarHeader} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.sidebarItemSkeleton} />
          ))}
        </div>

        {/* Content Area Skeleton */}
        <div className={styles.contentAreaSkeleton}>
          <div className={styles.contentHeader} />
          <div className={styles.contentBody}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.contentSection} />
            ))}
          </div>
        </div>

        {/* Bottom Nav Skeleton */}
        <div className={styles.bottomNavSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.bottomNavItemSkeleton} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRootLayoutLoading;