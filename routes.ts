/**
 * The default redirect path for user registration
 * @type {string}
 */
export const REGISTER_ROUTE: string = '/auth/register';

/**
 * The default redirect path for logging in
 * @type {string}
 */
export const LOGIN_ROUTE: string = '/auth/login';

/**
 * The default redirect path for email verification
 * @type {string}
 */
export const EMAIL_VERIFICATION_ROUTE: string = '/auth/verify-email';

/**
 * The default redirect path for password recovery
 * @type {string}
 */
export const FORGOT_PASSWORD_ROUTE: string = '/auth/forgot-password';

/**
 * The default redirect path for resetting the password
 * @type {string}
 */
export const RESET_PASSWORD_ROUTE: string = '/auth/reset-password';

// /**
//  * The default redirect path for resetting the password
//  * @type {string}
//  */
// export const TWO_FACTOR_ROUTE: string = '/auth/reset-password';

/**
 * The redirect path for authentication error page
 * @type {string}
 */
export const AUTH_ERROR_ROUTE: string = '/auth/error';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const LOGIN_REDIRECT_ROUTE: string = '/settings';

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', RESET_PASSWORD_ROUTE];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  AUTH_ERROR_ROUTE,
  EMAIL_VERIFICATION_ROUTE,
  FORGOT_PASSWORD_ROUTE,
];
