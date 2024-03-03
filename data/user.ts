import { db } from '@/lib/db';

/**
 * @description Find the database user by email
 * @param {string} email The user email
 * @returns {object|null}
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

/**
 * @description Find the database user by Id
 * @param {string} id The user Id
 * @returns {object|null}
 */
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
