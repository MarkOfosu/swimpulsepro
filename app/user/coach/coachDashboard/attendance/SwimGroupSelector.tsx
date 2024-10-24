

// SwimGroupSelector.tsx
import React from 'react';
import styles from '../../../../styles/SwimGroupSelector.module.css';


interface Swimmer {
    id: string;
    firstName: string;
    lastName: string;
  }
  
    interface SwimGroup {
        id: string;
        name: string;
    }


interface SwimGroupSelectorProps {
  groups: SwimGroup[];
  onSelect: (groupId: string) => void;
}

export const SwimGroupSelector: React.FC<SwimGroupSelectorProps> = ({ groups, onSelect }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="groupSelect" className={styles.label}>Select Swim Group:</label>
      <select
        id="groupSelect"
        onChange={(e) => onSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">-- Select a group --</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
};
