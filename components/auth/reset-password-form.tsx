'use client';

import { resetPassword } from '@/actions/reset-password';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LOGIN_ROUTE } from '@/routes';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import * as z from 'zod';
import { FormErrorAlert } from '../form-error';
import { FormSuccessAlert } from '../form-success';
import { Button } from '../ui/button';
import { PasswordInput } from '../ui/password-input';
import CardWrapper from './card-wrapper';

/**
 * @description The authentication set new password form
 */
export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(
    token ? '' : 'Something went wrong!',
  );
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setSuccess('');
    setError('');

    startTransition(() => {
      resetPassword(values, token)
        .then((message?: { success?: string; error?: string }) => {
          setSuccess(message?.success);
          setError(message?.error);
        })
        .catch((err) => {
          setError(err.message);
        });
    });
  };

  const formAlerts = (
    <>
      <FormErrorAlert message={error} />
      <FormSuccessAlert message={success} />
    </>
  );

  let cardBody = formAlerts;

  if (!success && token) {
    cardBody = (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Type the new password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm the password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {formAlerts}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !token}
          >
            {isPending && <PulseLoader color="white" />}
            Reset password
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref={LOGIN_ROUTE}
    >
      {cardBody}
    </CardWrapper>
  );
};
