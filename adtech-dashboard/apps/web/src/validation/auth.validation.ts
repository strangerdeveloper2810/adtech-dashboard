import * as z from "zod";

const loginSchema = z.object({
  email: z.email().nonempty("Email is required").trim(),
  password: z
    .string()
    .nonempty("Password is required") // check rỗng trước
    .min(6, "Password must be at least 6 characters"), // rồi mới check length
});

export type LoginInput = z.infer<typeof loginSchema>;

export { loginSchema };
