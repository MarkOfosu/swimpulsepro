'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../../page';
import { useToast } from '@components/ui/toasts/Toast';
import styles from '../../../../../styles/AddSwimmer.module.css';

const AddSwimmerPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [group, setGroup] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const groupName = params.groupName as string;
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id, name')
          .eq('name', decodeURIComponent(groupName))
          .single();

        if (error) throw error;
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
        showToast('Failed to fetch group details', 'error');
        router.push('/user/coach/swimGroup');
      }
    };

    fetchGroup();
  }, [groupName, supabase, showToast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) {
      showToast('Invalid group', 'error');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('swimmers')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          date_of_birth: dateOfBirth,
          group_id: group.id
        })
        .select()
        .single();

      if (error) throw error;

      showToast('Swimmer added successfully', 'success');
      router.push(`/user/coach/swimGroup/${encodeURIComponent(group.name)}`);
    } catch (error) {
      console.error('Error adding swimmer:', error);
      showToast('Failed to add swimmer', 'error');
    }
  };

  if (!group) {
    return <CoachPageLayout><div>Loading...</div></CoachPageLayout>;
  }

  return (
    <CoachPageLayout>
      <div className={styles.addSwimmerContainer}>
        <h1>Add Swimmer to {group.name}</h1>
        <form onSubmit={handleSubmit} className={styles.addSwimmerForm}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <button type="submit">Add Swimmer to {group.name}</button>
        </form>
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default AddSwimmerPage;