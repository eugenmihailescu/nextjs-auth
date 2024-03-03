'use client';

import { login } from '@/actions/login';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FORGOT_PASSWORD_ROUTE, REGISTER_ROUTE } from '@/routes';
import { LoginSchema } from '@/schemas';
import { LoginProvidersType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import * as z from 'zod';
import { FormErrorAlert } from '../form-error';
import { FormSuccessAlert } from '../form-success';
import { FormWarningAlert } from '../form-warning';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import CardWrapper from './card-wrapper';

/**
 * @description The authentication login form
 */
export const LoginForm = ({
  loginProviders,
}: {
  loginProviders?: LoginProvidersType;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [warning, setWarning] = useState<string | undefined>('');
  const [twoFactor, setTwoFactor] = useState<boolean | undefined>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setSuccess('');
    setError('');
    setWarning('');
    setTwoFactor(false);

    startTransition(() => {
      login({ ...values, code: twoFactor ? values.code : undefined })
        .then(
          (message?: {
            success?: string;
            error?: string;
            warning?: string;
            twoFactor?: boolean;
          }) => {
            setSuccess(message?.success);
            setWarning(message?.warning);
            setError(message?.error);

            if (message?.twoFactor) {
              setTwoFactor(message.twoFactor);
            } else {
              form.reset();
            }
          },
        )
        .catch((err) => {
          form.reset();
          setError(
            err.digest
              ? `Something went wrong (ref: ${err.digest})`
              : err.message,
          );
        });
    });
  };

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different authentication provider!'
      : '';

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref={REGISTER_ROUTE}
      loginProviders={isPending ? undefined : loginProviders}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {twoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two-Factor Code (2FA)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456"
                          type="number"
                          min={100_000}
                          max={999_999}
                          disabled={isPending}
                          className="appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  Confirm the 2FA code we've sent you by email
                </span>
              </>
            )}
            {!twoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Type the password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button size="sm" variant="link" asChild className="px-0 font-normal">
            <Link href={FORGOT_PASSWORD_ROUTE}>Forgot password?</Link>
          </Button>
          <FormErrorAlert message={error || urlError} />
          <FormWarningAlert message={warning} />
          <FormSuccessAlert message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <PulseLoader color="white" />}
            {twoFactor ? 'Confirm' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
