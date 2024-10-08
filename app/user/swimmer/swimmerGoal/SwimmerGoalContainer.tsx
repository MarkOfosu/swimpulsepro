import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../../../lib/getUserDetails'
import Goal from './Goal'; 

const SwimmerGoalsContainer: React.FC = () => {
  const [swimmerId, setSwimmerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await getUserDetails();
      if (userData && userData.role === 'swimmer') {
        setSwimmerId(userData.id);
      }
    };

    fetchUserDetails();
  }, []);

  if (!swimmerId) {
    return <div>Loading...</div>; 
  }

  return <Goal swimmerId={swimmerId} />;
};

export default SwimmerGoalsContainer;