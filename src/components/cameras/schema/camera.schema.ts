import { z } from "zod";

export const cameraSchema = z.object({
  name: z
    .string({error: "Camera name is required"})
    .min(3, "Camera name must be at least 3 characters"),

 code: z
  .string({error: "Camera code is required"})
  .min(3, "Camera code must be at least 3 characters")
  .regex(/^[a-z_0-9]+$/, "Only letters, numbers and underscore allowed")
  .transform((val) => val.toLowerCase()),


  gateType: z.enum(["ENTRY", "EXIT"], {
    error: "Please select a gate type",
  }),

  location: z
    .string({error: "Location is required"})
    .min(5, "Location must be at least 5 characters"),
   
  rtspUrl: z
  .url({error: "Please provide a valid RTSP URL"})
  .min(10, "RTSP URL must be at least 10 characters"),
  


  credentials: z.object({
    username: z
      .string({error: "Username is required"})
      .min(2, "Username must be at least 2 characters"),

    password: z
      .string({error: "Password is required"})
      .min(1, "Password cannot be empty"),
  }),
});

/**
 * 🔹 Type inference
 * Used in form, hook, API
 */
export type TCameraFormValues = z.infer<typeof cameraSchema>;
