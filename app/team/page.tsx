import TeamLayout from '../layouts/TeamLayout';
import RootLayout from '../layout';

//to be fixed: remove rootlayout to prevent double html tags from being rendered. find a way to send layoutType to the TeamLayout component
const TeamPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RootLayout layoutType="team">
      <TeamLayout>{children}</TeamLayout>
    </RootLayout>
  );
};

export default TeamPage;