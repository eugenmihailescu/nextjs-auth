import { LoginProvidersType, LoginProvidersTypes } from '@/types';
import bcrypt from 'bcryptjs';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description A Tailwind CSS class merger helper
 * @param {...ClassValue[]} inputs The input CSS classes
 * @returns {string}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @description Asynchronously generates a hash for the given password.
 * @export
 * @param {string} password The password to hash
 * @param {(string | number)} [salt=10] Salt length to generate or salt to use
 */
export async function hashPassword(
  password: string,
  salt: string | number = 10,
) {
  return bcrypt.hash(password, salt);
}

/**
 * @description Get the supported social login providers
 * @export
 * @returns {Object} Returns an object where the key are the login provider's key and their associated values is true if valid, false otherwise.
 */
export function getSocialLoginProviders(): LoginProvidersType {
  const defaultSocialLogins = {
    [LoginProvidersTypes.google]: true,
    [LoginProvidersTypes.github]: true,
    [LoginProvidersTypes.spotify]: true,
  };

  const validSocialLogin = Object.keys(defaultSocialLogins).reduce(
    (carry, key) => {
      const prefix = key.toUpperCase();
      const isValid =
        process.env[`${prefix}_CLIENT_ID`] &&
        process.env[`${prefix}_CLIENT_SECRET`];

      return Object.assign(carry, { [key]: isValid });
    },
    {},
  );

  return validSocialLogin;
}
