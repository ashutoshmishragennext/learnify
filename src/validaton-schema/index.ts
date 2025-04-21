import { z } from "zod";

// Assuming UserRole enum is imported or predefined
// export type Role = (typeof UserRole.enumValues)[number];

const emailSchema = z
  .string({ required_error: "Email is required!" })
  .min(1, { message: "Email is required!" })
  .email({ message: "Invalid email!" });

const passwordSchema = z
  .string({ required_error: "Password is required!" })
  .min(1, { message: "Password is required!" })
  .min(8, { message: "Password must be at least 8 characters!" });

const nameSchema = z
  .string({ required_error: "Full name is required!" })
  .min(1, { message: "Full name is required!" })
  .min(3, { message: "Full name must be at least 3 characters." })
  .max(50, { message: "Full name must be at most 50 characters." });

const phoneSchema = z
  .string({ required_error: "Phone number is required!" })
  .min(10, { message: "Phone number must be at least 10 characters." })
  .regex(/^[0-9]+$/, { message: "Phone number must be numeric!" });

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordSchema = z.object({
  password: passwordSchema,
});

// Assuming UserRole.enumValues exists, you can define it as:
export const RoleEnum = z.enum(['STUDENT', 'ADMIN'], {
  invalid_type_error: "Invalid role!",
});

export const RegisterUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema.optional(),
  role: RoleEnum.optional(), // Optional role, but can be added if required.
});
