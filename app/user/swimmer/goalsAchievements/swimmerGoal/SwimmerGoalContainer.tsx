import React, { useState, useEffect } from 'react';
import { useUser } from '@app/context/UserContext';
import Goal from './Goal'; 

const SwimmerGoalsContainer: React.FC = () => {
  const { user } = useUser();
  const [swimmerId, setSwimmerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSwimmerId(user.id);
    }
  }, [user]);

  if (!swimmerId) {
    return <div>Loading...</div>; 
  }

  return <Goal swimmerId={swimmerId} />;
};

export default SwimmerGoalsContainer;