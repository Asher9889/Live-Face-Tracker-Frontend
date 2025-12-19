import { z } from "zod";

export const cameraSchema = z.object({
  name: z
    .string()
    .min(2, "Camera name must be at least 2 characters"),

 code: z
  .string()
  .min(2, "Camera code must be at least 2 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed")
  .transform((val) => val.toLowerCase()),


  gateType: z.enum(["ENTRY", "EXIT"], {
    error: "Please select a gate type",
  }),

  location: z
    .string()
    .min(5, "Location is required"),
   
  rtspUrl: z
    .string()
    .min(10, "RTSP URL is required")
    .refine(
      (url) => url.startsWith("rtsp://") &&
        /^rtsp:\/\/[^\s/$.?#].[^\s]*$/i.test(url),
      "Invalid RTSP URL format"
    ),

  credentials: z.object({
    username: z
      .string()
      .min(1, "Username is required"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

/**
 * 🔹 Type inference
 * Used in form, hook, API
 */
export type TCameraFormValues = z.infer<typeof cameraSchema>;
