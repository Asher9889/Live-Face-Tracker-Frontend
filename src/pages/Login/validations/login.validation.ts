import z from "zod";


const loginSchema  = z.object({
  username: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type TLoginSchema = z.infer<typeof loginSchema>;

export default loginSchema;
export { type TLoginSchema };