import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FcLock } from 'react-icons/fc';

const font = Poppins({ subsets: ['latin'], weight: ['600'] });

interface HeaderProps {
  label: string;
}

/**
 * @description The card wrapper header
 * @param {HeaderProps} props The header properties
 */
export const Header = ({ label }: HeaderProps) => (
  <div className="flex w-full flex-col items-center gap-y-4">
    <h1 className={cn('text-2xl font-semibold', font.className)}>
      <FcLock className="inline-block" /> Frontend CPanel
    </h1>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);
