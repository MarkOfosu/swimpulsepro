import { Suspense } from 'react';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import ResetPassword from './ResetPassword';
import Footer from '@components/elements/Footer';

const ResetPasswordPage = () => {
  return (
    <>
      <WelcomeNavbar />
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
      <Footer />
    </>
  );
};

export default ResetPasswordPage;
