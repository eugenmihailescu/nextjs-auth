'use client';

import { LOGIN_REDIRECT_ROUTE } from '@/routes';
import { LoginProvidersType, LoginProvidersTypes } from '@/types';
import { signIn } from 'next-auth/react';
import { FaGithub, FaSpotify } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';

interface SocialProps {
  loginProviders?: LoginProvidersType;
  disabled?: boolean;
}

/**
 * @description The authentication social logging buttons
 */
export const Social = ({ loginProviders, disabled }: SocialProps) => {
  const onClick = (provider: LoginProvidersTypes) => {
    signIn(provider, { callbackUrl: LOGIN_REDIRECT_ROUTE });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      {loginProviders?.google && (
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick(LoginProvidersTypes.google)}
          disabled={disabled}
          title="Authenticate with Google account"
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
      )}
      {loginProviders?.github && (
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick(LoginProvidersTypes.github)}
          disabled={disabled}
          title="Authenticate with GitHub account"
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      )}{' '}
      {loginProviders?.spotify && (
        <Button
          size="lg"
          className="w-full text-emerald-500 hover:text-emerald-500"
          variant="outline"
          onClick={() => onClick(LoginProvidersTypes.spotify)}
          disabled={disabled}
          title="Authenticate with Spotify account"
        >
          <FaSpotify className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
