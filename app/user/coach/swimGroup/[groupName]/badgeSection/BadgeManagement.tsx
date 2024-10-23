import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from '../../../../../styles/BadgeManagement.module.css';

const badgeIcons = ['🏅', '🎖️', '🥇', '🥈', '🥉', '🏆', '🌟', '💪', '🏊‍♂️', '🏊‍♀️'];

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const BadgeManagementPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [swimGroupId, setSwimGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { groupName } = useParams();
  const supabase = createClient();

  useEffect(() => {
    const getSwimGroupId = async () => {
      if (!groupName) {
        setError('Group name is missing');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id')
          .eq('name', decodeURIComponent(groupName as string))
          .single();

        if (error) throw error;
        if (!data) throw new Error('No swim group found with the given name');

        setSwimGroupId(data.id);
        setError(null);
      } catch (err) {
        console.error('Error fetching swim group:', err);
        setError('Failed to fetch swim group. Please check the group name and try again.');
        setSwimGroupId(null);
      }
    };

    getSwimGroupId();
  }, [groupName, supabase, setSwimGroupId, setError]);

 

  const fetchBadges = React.useCallback(async () => {
    if (!swimGroupId) return;

    try {
      const { data, error } = await supabase
        .from('swim_group_badges')
        .select('badges (*)')
        .eq('swim_group_id', swimGroupId);

      if (error) throw error;

      setBadges(data?.flatMap(item => item.badges) || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to fetch badges. Please try again later.');
    }
  }, [swimGroupId, supabase]);

  useEffect(() => {
    if (swimGroupId) {
      fetchBadges();
    }
  }, [swimGroupId, fetchBadges]);

  const createBadge = async () => {
    if (!newBadgeName || !selectedIcon || !swimGroupId) return;

    try {
      const { data, error } = await supabase
        .from('badges')
        .insert({
          name: newBadgeName,
          icon: selectedIcon,
          description: `Custom badge for ${groupName}`
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('swim_group_badges').insert({
        swim_group_id: swimGroupId,
        badge_id: data.id,
        name: newBadgeName
      });

      await fetchBadges();
      setNewBadgeName('');
      setSelectedIcon('');
      setError(null);
    } catch (err) {
      console.error('Error creating badge:', err);
      setError('Failed to create badge. Please try again later.');
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Badge Management for {decodeURIComponent(groupName as string)}</h1>
      <div className={styles.createBadgeSection}>
        <h2 className={styles.sectionTitle}>Create New Badge</h2>
        <input
          type="text"
          value={newBadgeName}
          onChange={(e) => setNewBadgeName(e.target.value)}
          placeholder="Enter badge name"
          className={styles.input}
        />
        <div className={styles.iconSelector}>
          {badgeIcons.map(icon => (
            <button
              key={icon}
              onClick={() => setSelectedIcon(icon)}
              className={`${styles.iconButton} ${selectedIcon === icon ? styles.selectedIcon : ''}`}
              data-icon={icon}
            >
              {icon}
            </button>
          ))}
        </div>
        {(newBadgeName || selectedIcon) && (
          <div className={styles.badgePreview}>
            <h3>Preview</h3>
            <div className={styles.previewContent}>
              {selectedIcon && (
                <span className={styles.previewIcon} data-icon={selectedIcon}>
                  {selectedIcon}
                </span>
              )}
              {newBadgeName && <span className={styles.previewName}>{newBadgeName}</span>}
            </div>
          </div>
        )}
        <button 
          onClick={createBadge} 
          disabled={!newBadgeName || !selectedIcon}
          className={styles.createButton}
        >
          Create Badge
        </button>
      </div>
      <div className={styles.existingBadgesSection}>
        <h2 className={styles.sectionTitle}>Existing Badges</h2>
        <div className={styles.badgeList}>
          {badges.map(badge => (
            <div key={badge.id} className={styles.badgeItem}>
              <span className={styles.badgeIcon} data-icon={badge.icon}>
                {badge.icon}
              </span>
              <span className={styles.badgeName}>{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeManagementPage;