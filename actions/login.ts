'use server';

import * as z from 'zod';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { LOGIN_REDIRECT_ROUTE } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import {
  generateVerificationToken,
  generateTwoFactorToken,
  getTokenExpiryDate,
} from '@/lib/tokens';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
/**
 * @description A server action that validates the login field values
 * @param {LoginSchema} values The login field values
 * @returns {Promise} Returns a promise that resolves success message in case of valid field values
 */
export const login = async (
  values: z.infer<typeof LoginSchema>,
): Promise<any> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.email) {
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return {
        warning:
          'Your email is not yet verified. A new confirmation email sent!',
      };
    }

    if (existingUser.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        );

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: 'Invalid 2FA code!' };
        }

        const hasExpired = twoFactorToken.expires < new Date();

        if (hasExpired) {
          return { error: '2FA code has expired!' };
        }

        await db.twoFactorToken.delete({
          where: {
            id: twoFactorToken.id,
          },
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: {
              id: existingConfirmation?.id,
            },
          });
        }

        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
            expires: getTokenExpiryDate(),
          },
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);

        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        );

        return { twoFactor: true };
      }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: LOGIN_REDIRECT_ROUTE,
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: `Something went wrong (${error.type})` };
      }
    }

    throw error;
  }
};
