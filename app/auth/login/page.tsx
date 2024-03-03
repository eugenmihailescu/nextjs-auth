import { LoginForm } from '@/components/auth/login-form';
import { getSocialLoginProviders } from '@/lib/utils';
import { Suspense } from 'react';

const socialLogin = getSocialLoginProviders();

const LoginPage = () => (
  <Suspense>
    <LoginForm loginProviders={socialLogin} />
  </Suspense>
);

export default LoginPage;
