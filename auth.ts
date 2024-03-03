import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { DefaultSession } from 'next-auth';
import { User } from '@prisma/client';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import authConfig from './auth.config';
import { db } from './lib/db';
import { AUTH_ERROR_ROUTE, LOGIN_ROUTE } from './routes';

type UserRole = 'USER' | 'ADMIN';

// customize the User, Session and JWT interfaces
declare module 'next-auth' {
  interface User {
    role: UserRole;
    emailVerified: Date | null;
  }

  interface Session {
    user: {
      role: UserRole;
      isTwoFactorEnabled?: boolean;
    } & DefaultSession['user'];
    accessToken?: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken?: string;
    role: UserRole;
    sub: string;
    isTwoFactorEnabled?: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // console.log('SIGN-IN');
      // console.log({ user, account });

      let isAllowedToSignIn =
        user &&
        (account?.provider !== 'credentials' ||
          (user.emailVerified && ['USER', 'ADMIN'].includes(user?.role)));

      // TODO: add 2FA check
      if (isAllowedToSignIn && user.id && (user as User).isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id,
        );

        isAllowedToSignIn =
          twoFactorConfirmation && twoFactorConfirmation.expires >= new Date();

        if (isAllowedToSignIn) {
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation?.id,
            },
          });
        }
      }

      if (isAllowedToSignIn) {
        return true;
      }

      // Return false to display a default error message
      return false;
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.

      // console.log('SESSION');
      // console.log({ session, token });

      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      session.accessToken = token.accessToken;

      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin

      // console.log('JWT');
      // console.log({ token, user, account });

      if (account) {
        token.accessToken = account.access_token;
      }

      if (user && user.role) {
        token.role = user.role;
        token.isTwoFactorEnabled = (user as User).isTwoFactorEnabled;
      }

      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      // console.log('LINK ACCOUNT');
      // console.log({ user });

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  pages: {
    signIn: LOGIN_ROUTE,
    error: AUTH_ERROR_ROUTE,
  },
  adapter: PrismaAdapter(db),
  ...authConfig,
});
