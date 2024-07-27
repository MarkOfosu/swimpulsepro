import TeamLayout from '../layouts/TeamLayout';
import RootLayout from '../layout';

const TeamPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RootLayout layoutType="team">
      <TeamLayout>{children}</TeamLayout>
    </RootLayout>
  );
};

export default TeamPage;