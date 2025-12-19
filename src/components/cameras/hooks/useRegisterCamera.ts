import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cameraSchema, type TCameraFormValues } from "../schema/camera.schema"
import { createCamera, getCamera } from "../api/camera.api";

function useRegisterCamera(onSuccess?: () => void) {
  const methods = useForm<TCameraFormValues>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: "",
      code: "",
      gateType: "ENTRY",
      location: "",
      rtspUrl: "",
      credentials: {
        username: "",
        password: "",
      },
    },
    // mode: "onChange",
    // reValidateMode: "onChange",
    mode: "onSubmit",
reValidateMode: "onSubmit",

  });

  const mutation = useMutation({
    mutationFn: createCamera,
    onSuccess: () => {
      methods.reset();        
      onSuccess?.();         
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = methods.handleSubmit((camera: TCameraFormValues) => {
    mutation.mutate(camera);
  });

  const { isValid } = methods.formState;

  const disableSubmit = !isValid;

  return {
    ...methods,
    onSubmit,
    mutation,
    disableSubmit,
  };
}


function useCamera() {
  const query = useQuery({
    queryKey: ["cameras"],
    queryFn: getCamera,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
}

export { useRegisterCamera, useCamera };
