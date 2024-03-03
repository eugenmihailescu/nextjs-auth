import { EmailVerificationForm } from '@/components/auth/verification-form';
import { Suspense } from 'react';

const EmailVerificationPage = () => (
  <Suspense>
    <EmailVerificationForm />
  </Suspense>
);

export default EmailVerificationPage;
