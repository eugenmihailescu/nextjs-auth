'use client';

import { LOGIN_ROUTE } from '@/routes';
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  children: React.ReactNode;
  mode: 'modal' | 'redirect';
  // asChild: boolean;
}

/**
 * @description The authentication card login button
 * @param {LoginButtonProps} props The button properties
 */
const LoginButton = ({ children, mode /* ,asChild */ }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(LOGIN_ROUTE);
  };

  if (mode === 'modal') {
    return <span>TODO: implement modal</span>;
  }

  return (
    <span
      className="cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </span>
  );
};

export default LoginButton;
