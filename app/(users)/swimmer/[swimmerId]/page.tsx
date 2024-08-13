import ContentRootLayout from "@app/layouts/ContentRootlayout";
const SwimmerPage = ({
    params}: {
    params: {
        id: string;
    };
}) => {

  const links = [
    { href: '/swimmer/dashboard', label: 'Dashboard' },
    { href: '/swimmer/analytics', label: 'Analytics' },
    
  ];

   
  return (
    <ContentRootLayout links={links}>
      <h1>Swimmer Dashboard</h1>
      <p>Content...</p>
    </ContentRootLayout>
  );
};
export default SwimmerPage;
