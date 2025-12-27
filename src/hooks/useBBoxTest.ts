import { subscribeBBox } from "@/services/ws/bbox";
import { useEffect, useRef } from "react";

function useBBoxTest(cameraCode: string) {
  const bboxRef = useRef<any | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeBBox(cameraCode, (payload:any) => {
      bboxRef.current = payload;
    });
    return unsubscribe;
  }, [cameraCode]);

  return bboxRef;
}

export default useBBoxTest;