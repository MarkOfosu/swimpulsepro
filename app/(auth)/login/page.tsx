// /app/login/page.tsx
import { isLogin } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const loggedIn = await isLogin();

  if (loggedIn) {
    // Redirect to the dashboard if the user is already logged in
    redirect('/user/coach/dashboard');
  }
  return <LoginForm />;
}
