// import React, { ReactNode, useEffect, useRef } from 'react';
// import styles from '../styles/Card.module.css';

// interface Props {
//   title: string;
//   description?: string;
//   children: ReactNode;
//   size?: 'small' | 'medium' | 'large';
//   color?: 'default' | 'dark' | 'light' | 'primary' | 'secondary';
//   glow?: boolean; // New optional prop to enable glow effect
// }

// export default function Card({ title, description, children, size = 'medium', color = 'default', glow = false }: Props) {
//   const cardRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (glow) {
//       const card = cardRef.current;
//       if (card) {
//         const handleMouseMove = (e: MouseEvent) => {
//           const rect = card.getBoundingClientRect();
//           const x = e.clientX - rect.left;
//           const y = e.clientY - rect.top;
//           card.style.setProperty('--x', `${x}px`);
//           card.style.setProperty('--y', `${y}px`);
//         };

//         card.addEventListener('mousemove', handleMouseMove);

//         return () => {
//           card.removeEventListener('mousemove', handleMouseMove);
//         };
//       }
//     }
//   }, [glow]);

//   return (
//     <div
//       className={`${styles.cardContainer} ${styles[size]} ${styles[color]} ${glow ? styles.glow : ''}`}
//       ref={cardRef}
//     >
//       <div className={styles.cardHeader}>
//         <h3 className={styles.cardTitle}>{title}</h3>
//         {description && <p className={styles.cardDescription}>{description}</p>}
//       </div>
//       <div className={styles.cardContent}>
//         {children}
//       </div>
//     </div>
//   );
// }


// File: components/ui/Card.tsxd
import React from 'react';
import styles from '../styles/Card.module.css';

interface CardProps {

  children: React.ReactNode;

  className?: string;

}


export const Card: React.FC<CardProps> = ({ children, className }) => {

  return <div className={className}>{children}</div>;

};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.cardHeader}>{children}</div>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {

  return <div className={className}>{children}</div>;

};











