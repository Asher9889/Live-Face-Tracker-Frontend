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
  streamConfig: z.object({
    aiFps: z
      .number({error: "AI FPS must be a number"})
      .min(2, "AI FPS must be at least 2"),
    displayFps: z
      .number({error: "Display FPS must be a number"})
      .min(2, "Display FPS must be at least 2"),
  }).optional(),
  enabled: z.boolean().optional(),
  roi: z.object({
    enabled: z.boolean().optional(),
    polygons: z.array(z.array(z.number())).optional(),
  }).optional(),
  wsStreamId: z.string().optional(),
  status: z.object({
    online: z.boolean().optional(),
    lastCheckedAt: z.string().optional(),
    lastFrameAt: z.string().optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TCameraFormValues = z.infer<typeof cameraSchema>;



// "streamConfig": {
//     "aiFps": 25,
//     "displayFps": 25
//   },
//   "enabled": true,
//   "roi": {
//     "enabled": true,
//     "polygons": [
//       [10, 20],
//       [200, 20],
//       [200, 250],
//       [10, 250]
//     ]
//   },
//   "wsStreamId": "exit_1",
//   "status": {
//     "online": true,
//     "lastCheckedAt": "2025-01-01T10:00:00.000Z",
//     "lastFrameAt": "2025-01-01T10:00:01.000Z"
//   }
// //   "createdAt": "2025-01-01T09:00:00.000Z",
// //   "updatedAt": "2025-01-01T09:00:00.000Z"
// }