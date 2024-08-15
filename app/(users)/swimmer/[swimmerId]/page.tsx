import ContentRootLayout from "@app/layouts/ContentRootlayout";
const SwimmerPage = ({
    params}: {
    params: {
        id: string;
    };
}) => {

  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    { href: '/user/swimmer/analytics', label: 'Analytics' },
    
  ];

   
  return (
    <ContentRootLayout links={links}>
      <h1>Swimmer Dashboard</h1>
      <p>Content...</p>
    </ContentRootLayout>
  );
};
export default SwimmerPage;
