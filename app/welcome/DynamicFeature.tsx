
import Image from 'next/image';

import React from 'react';
import styles from '../styles/DynamicFeatureSection.module.css';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface FeatureProps {
  title: string;
  description: string;
  imageSrc?: StaticImport | string; //
  imageSide?: 'left' | 'right'; // Control whether image is on the left or right
  subContent?: React.ReactNode; // For lists, tables, or additional content
  backgroundColor?: string; // Optional background color
  showTable?: boolean; // Optional table
  tableData?: { parameter: string, description: string, example?: string }[]; // Optional table data
}

const FeatureSection: React.FC<FeatureProps> = ({
  title,
  description,
  imageSrc,
  imageSide = 'right',
  subContent,
  backgroundColor = '#1e1e2f', // Default background color
  showTable = false,
  tableData = []
}) => {
  return (
    <div
      className={styles.featureContainer}
      style={{ backgroundColor }} // Apply background color or image
    >
      <div className={styles.featureContent}>
        {imageSrc && imageSide === 'left' && (
          <Image src={imageSrc} alt="Feature Image" className={styles.featureImage} />
        )}
        
        <div className={styles.mainContent}>
          <h2>{title}</h2>
          <p>{description}</p>
          {subContent && <div className={styles.subContent}>{subContent}</div>}

          {showTable && tableData.length > 0 && (
            <table className={styles.metricTable}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Description</th>
                  {tableData[0]?.example && <th>Example</th>}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.parameter}</td>
                    <td>{row.description}</td>
                    {row.example && <td>{row.example}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {imageSrc && imageSide === 'right' && (
          <Image src={imageSrc} alt="Feature Image" className={styles.featureImage} />
        )}
      </div>
    </div>
  );
};

export default FeatureSection;

