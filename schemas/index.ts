import * as z from 'zod';

const PASSWORD_MIN_LENGTH = Math.max(
  +(process.env.PASSWORD_MIN_LENGTH || 0),
  6,
);

const refineConfirmPassword = (zodObject: z.ZodTypeAny) =>
  zodObject.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// user login form schema
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.string().optional(),
});

// user forgot password form schema
export const ForgotPasswordSchema = LoginSchema.omit({
  name: true,
  password: true,
});

// unrefined/base user registration form schema
export const BaseRegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    message: `Minimum ${PASSWORD_MIN_LENGTH} chars required`,
  }),
  confirmPassword: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
});

// user registration form schema with refined password confirmation
export const RegisterSchema = refineConfirmPassword(BaseRegisterSchema);

// user password reset form schema
export const ResetPasswordSchema = refineConfirmPassword(
  BaseRegisterSchema.omit({
    email: true,
    name: true,
  }),
);
