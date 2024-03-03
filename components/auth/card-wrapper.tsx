'use client';

import { LoginProvidersType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { LinkButton } from './back-button';
import { Header } from './header';
import { Social } from './social';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  loginProviders?: LoginProvidersType;
}

/**
 * @description An authentication card component
 * @param {CardWrapperProps} props The card properties
 */
const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  loginProviders,
}: CardWrapperProps) => (
  <Card className="wdfshadow-md  w-[400px]">
    <CardHeader>
      <Header label={headerLabel} />
    </CardHeader>
    <CardContent>{children}</CardContent>
    {loginProviders && (
      <CardFooter>
        <Social loginProviders={loginProviders} />
      </CardFooter>
    )}
    <CardFooter>
      <LinkButton label={backButtonLabel} href={backButtonHref} />
    </CardFooter>
  </Card>
);

export default CardWrapper;
