import { cn } from '@/lib/utils';
import React from 'react';
import { MdAlternateEmail } from 'react-icons/md';
import { Input, InputProps } from './input';

export interface EmailInputProps extends InputProps {
  showEmailIcon?: boolean;
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ showEmailIcon = true, ...props }, ref) => (
    <div className={cn('relative', props.className)}>
      <Input
        autoComplete="off"
        ref={ref}
        {...props}
        type="email"
        className={showEmailIcon ? 'pl-10' : ''}
      />
      {showEmailIcon && (
        <MdAlternateEmail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      )}
    </div>
  ),
);
EmailInput.displayName = 'EmailInput';

export { EmailInput };
