// useCameraToken.ts
import { useQuery } from "@tanstack/react-query";
import { getToken } from "./camera.api";

export function useCameraToken(cameraCode: string) {
  return useQuery({
    queryKey: ["cameraToken", cameraCode],
    queryFn: () => getToken(cameraCode),
    enabled: !!cameraCode,
  });
}
