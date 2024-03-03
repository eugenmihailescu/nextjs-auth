import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/lib/db';
import { PasswordResetToken, VerificationToken } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_TOKEN_LIFESPAN =
  (Number(process.env.DEFAULT_TOKEN_LIFESPAN) || 60) * 60 * 1000; // default 60min

/**
 * @description Get the token expiration date
 * @param {Date} [date] The relative date (default now)
 * @returns {Date} Returns the token expiry absolute date
 */
export const getTokenExpiryDate = (date?: Date): Date =>
  new Date(+(date || new Date()) + DEFAULT_TOKEN_LIFESPAN);

/**
 * @description Generates a new verification token in the VerificationToken table
 * @param {string} email The email address
 * @returns {Promise} Returns a promise that resolves the generated verification token
 */
export const generateVerificationToken = async (
  email: string,
): Promise<VerificationToken> => {
  const token = uuidv4();
  const expires = getTokenExpiryDate();

  // check if there exists already a token for the email
  const existingToken = await getVerificationTokenByEmail(email);

  // remove the existing token
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create a new verification token for the email
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

/**
 * @description Generates a new password reset token in the PasswordResetToken table
 * @param {string} email The email address
 * @returns {Promise} Returns a promise that resolves the generated password reset token
 */
export const generatePasswordResetToken = async (
  email: string,
): Promise<PasswordResetToken> => {
  const token = uuidv4();
  const expires = getTokenExpiryDate();

  // check if there exists already a token for the email
  const existingToken = await getPasswordResetTokenByEmail(email);

  // remove the existing token
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create a new password reset token for the email
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = getTokenExpiryDate();

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
