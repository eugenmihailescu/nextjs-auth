import {
  LOGIN_REDIRECT_ROUTE,
  LOGIN_ROUTE,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.some((pathname) =>
    new RegExp(`^${pathname.replace(/\//g, '\\/')}\\b`).test(nextUrl.pathname),
  );

  console.log({ isLoggedIn, isApiAuthRoute, isPublicRoute, isAuthRoute });

  // always allow authentication-purpos routes
  if (isApiAuthRoute) {
    return;
  }

  // accessing an authentication route?
  if (isAuthRoute) {
    // logged in users should not be able to access these routes
    if (isLoggedIn) {
      return Response.redirect(new URL(LOGIN_REDIRECT_ROUTE, nextUrl));
    }

    return;
  }

  // protected route and not logged in?
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }

  // do nothing, allow route access!
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
