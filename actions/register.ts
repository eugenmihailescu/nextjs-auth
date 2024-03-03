'use server';

import { db } from '@/lib/db';
import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { hashPassword } from '@/lib/utils';
import { RegisterSchema } from '@/schemas';

/**
 * @description A server action that validates the registering field values
 * @param {RegisterSchema} values The registering field values
 * @returns {Promise} Returns a promise that resolves to success message in case of valid field values
 * @throws {Error} Throws an error in case of invalid field values
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  const hashedPassword = await hashPassword(password);

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
