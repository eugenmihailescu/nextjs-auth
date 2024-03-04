import { useSession } from 'next-auth/react';

/**
 * @description Get the current user from session data
 * @returns {Object}
 */
export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
