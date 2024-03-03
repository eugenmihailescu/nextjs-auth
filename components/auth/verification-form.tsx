'use client';

import { verifyEmail } from '@/actions/verify-email';
import { LOGIN_ROUTE } from '@/routes';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { FormErrorAlert } from '../form-error';
import { FormSuccessAlert } from '../form-success';
import CardWrapper from './card-wrapper';

export const EmailVerificationForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (!token) {
        return { error: 'Missing token!' };
      }
      const message = await verifyEmail(token);
      if (message.success) {
        setSuccess(message.success);
      }
      if (message.error) {
        setError(message.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm email"
      backButtonLabel="Back to login"
      backButtonHref={LOGIN_ROUTE}
    >
      <div className="flex w-full items-center justify-center">
        {!error && !success ? <BeatLoader /> : null}
        {!success && <FormErrorAlert message={error} />}
        <FormSuccessAlert message={success} />
      </div>
    </CardWrapper>
  );
};
