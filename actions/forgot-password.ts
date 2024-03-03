'use server';

import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ForgotPasswordSchema } from '@/schemas';

/**
 * @description A server action that validates the registering field values
 * @param {ResetPasswordSchema} values The registering field values
 * @returns {Promise} Returns a promise that resolves to success message in case of valid field values
 * @throws {Error} Throws an error in case of invalid field values
 */
export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>,
) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser?.emailVerified) {
    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  }

  return { success: 'Reset password email sent!' };
};
