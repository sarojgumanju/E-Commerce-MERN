import * as z from "zod";
import { emailRegex, passwordRegex } from "../../constants/regex.js";
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MERCHANT,
  ROLE_SUPER_ADMIN,
} from "../../constants/roles.js";

export const userSchema = z.object({
  name: z.string().check(z.minLength(3), z.maxLength(50)).trim(),
  email: z.string().regex(emailRegex, { error: "Invalid email address." }),
  password: z
    .string()
    .regex(passwordRegex, {
      error: "Password must contain upper case, lower case, characters",
    })
    .check(z.minLength(6)),
  phone: z.string().check(z.minLength(5), z.maxLength(10)),
  isActive: z.boolean().default(true),
  roles: z
    .array(z.enum([ROLE_ADMIN, ROLE_CUSTOMER, ROLE_MERCHANT, ROLE_SUPER_ADMIN]))
    .default([ROLE_CUSTOMER]),
  address: z.object({
    city: z.string(),
    province: z.string().optional(),
    street: z.string().optional(),
    country: z.string().optional().default("Nepal"),
  }),
});
