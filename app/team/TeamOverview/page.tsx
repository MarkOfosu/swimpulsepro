// app/team/team-overview/page.tsx
import React from 'react';
import TeamLayout from '../page';
import Card from '@components/ui/Card';

const TeamOverview: React.FC = () => {
  return (
    <TeamLayout>
      <h1>Team Overview</h1>
      <Card title="Team Stats card" description='Team stats for the current season'  size='large' color='dark' footer={'footer info here'}>
        <p>Content on card here..</p>
      </Card>   
    </TeamLayout>
  );
}

export default TeamOverview;
