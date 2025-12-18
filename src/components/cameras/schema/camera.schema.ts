import { z } from "zod";

export const cameraSchema = z.object({
  name: z
    .string()
    .min(2, "Camera name must be at least 2 characters"),

  code: z
    .string()
    .min(2, "Camera code is required"),

  gateType: z.enum(["ENTRY", "EXIT"], {
    error: "Please select a gate type",
  }),

  location: z
    .string()
    .min(2, "Location is required"),

  rtspUrl: z
    .string()
    .min(10, "RTSP URL is required")
    .refine(
      (url) => url.startsWith("rtsp://"),
      "RTSP URL must start with rtsp://"
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
