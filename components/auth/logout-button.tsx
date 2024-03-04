import { logout } from '@/actions/logout';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description The authentication logout button
 * @param {LogoutButtonProps} props The button properties
 */
const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <span
      className={cn('cursor-pointer', className)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (['Enter', 'Backspace'].includes(e.code)) {
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

export default LogoutButton;
