'use client';

import { forgotPassword } from '@/actions/forgot-password';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LOGIN_ROUTE } from '@/routes';
import { ForgotPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import * as z from 'zod';
import { FormErrorAlert } from '../form-error';
import { FormSuccessAlert } from '../form-success';
import { Button } from '../ui/button';
import { EmailInput } from '../ui/email-input';
import CardWrapper from './card-wrapper';

/**
 * @description The authentication forgot password form
 */
export const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setSuccess('');
    setError('');

    startTransition(() => {
      forgotPassword(values)
        .then((message?: { success?: string; error?: string }) => {
          setSuccess(message?.success);
          setError(message?.error);
        })
        .catch((err) => {
          setError(err.message);
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Already have an account?"
      backButtonHref={LOGIN_ROUTE}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <EmailInput
                      {...field}
                      placeholder="john.doe@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormErrorAlert message={error} />
          <FormSuccessAlert message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <PulseLoader color="white" />}
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
