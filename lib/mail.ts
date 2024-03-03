import { EMAIL_VERIFICATION_ROUTE, RESET_PASSWORD_ROUTE } from '@/routes';
import { Resend } from 'resend';
import { DEFAULT_TOKEN_LIFESPAN } from './tokens';

const DEFFAULT_MAIL_FROM = 'lsbolagen-cpanel <onboarding@resend.dev>';
const { APP_BASE_URL } = process.env;

const APP_NAME_LINK = `<a href="${APP_BASE_URL}">Frontend-CPanel</a>`;

const getTokenExpireHtml = (type: 'code' | 'token' | 'link') =>
  `<p>The ${type} expires in ${Math.round(DEFAULT_TOKEN_LIFESPAN / 1000 / 60)} minutes.</p>`;

const getFooterNotice =
  () => `<p style="color:gray;margin-top:1rem;font-size:0.65rem">If you didn't request this, you can safely ignore this email.
    Someone else might have typed your email address by mistake.`;

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = new URL(EMAIL_VERIFICATION_ROUTE, APP_BASE_URL);
  confirmLink.searchParams.append('token', token);

  await resend.emails.send({
    from: DEFFAULT_MAIL_FROM,
    to: email,
    subject: 'Confirm your email',
    html: `<p>We received a request to create an ${APP_NAME_LINK} account for your email address.</p>
    <p>Click <a href="${confirmLink.href}">here</a> to confirm the account creation.</p>
    ${getTokenExpireHtml('link')}
    ${getFooterNotice()}`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = new URL(RESET_PASSWORD_ROUTE, APP_BASE_URL);
  confirmLink.searchParams.append('token', token);

  await resend.emails.send({
    from: DEFFAULT_MAIL_FROM,
    to: email,
    subject: 'Confirm password reset',
    html: `<p>We received your request to reset the ${APP_NAME_LINK} password for your account.
    Click <a href="${confirmLink.href}">here</a> to reset your password.</p>
    ${getTokenExpireHtml('link')}
    ${getFooterNotice()}`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: DEFFAULT_MAIL_FROM,
    to: email,
    subject: '2FA code',
    html: `<p>We received your request to log you into your ${APP_NAME_LINK} account with this email address.</p>
    <p>To complete the Two-Factor Authentication (2FA) use the following code:</p>
    <pre>${token}</pre>
    ${getTokenExpireHtml('code')}
    ${getFooterNotice()}`,
  });
};
