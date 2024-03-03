'use server';

import * as z from 'zod';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/utils';
import { ResetPasswordSchema } from '@/schemas';

/**
 * @description A server action that validates the registering field values
 * @param {ResetPasswordSchema} values The registering field values
 * @returns {Promise} Returns a promise that resolves to success message in case of valid field values
 * @throws {Error} Throws an error in case of invalid field values
 */
export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: 'Missing token!' };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const hasExpired = existingToken.expires < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser?.emailVerified || !existingUser.email) {
    return { error: 'Something went wrong' };
  }

  const hashedPassword = await hashPassword(password);

  await db.user.update({
    where: {
      email: existingUser.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Password set successfully!' };
};
