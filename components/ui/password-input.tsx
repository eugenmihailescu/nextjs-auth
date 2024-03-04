import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoKey } from 'react-icons/go';
import { Input, InputProps } from './input';

export interface PasswordInputProps extends InputProps {
  showKeyIcon?: boolean;
  passwordVisibilityToogle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showKeyIcon = true, passwordVisibilityToogle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input
          className={cn(
            showKeyIcon ? 'pl-10' : '',
            passwordVisibilityToogle ? 'pr-10' : '',
          )}
          autoComplete="off"
          ref={ref}
          {...props}
          type={showPassword ? 'text' : 'password'}
        />
        {showKeyIcon && (
          <GoKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        )}
        {passwordVisibilityToogle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
