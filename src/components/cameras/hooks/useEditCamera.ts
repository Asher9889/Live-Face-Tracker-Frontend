import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cameraSchema, type TCameraFormValues } from "../schema/camera.schema";
import { updateCamera } from "../api/camera.api";
import { useEffect, useState } from "react";

interface Camera {
    id: string;
    name: string;
    code: string;
    gateType: "ENTRY" | "EXIT";
    role: "REGISTER" | "ASSIST" | "OBSERVE";
    location: string;
    rtspUrl: string;
    credentials: {
        username: string;
        password: string;
    };
}

function useEditCamera(camera: Camera | null, onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(true);

    const methods = useForm<TCameraFormValues>({
        resolver: zodResolver(cameraSchema),
        defaultValues: {
            name: "",
            code: "",
            location: "",
            rtspUrl: "",
            gateType: "ENTRY",
            role: "REGISTER",
            credentials: {
                username: "",
                password: "",
            },
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    // Update form with camera data when it changes
    useEffect(() => {
        if (camera) {
            methods.reset({
                name: camera.name,
                code: camera.code,
                location: camera.location,
                rtspUrl: camera.rtspUrl,
                gateType: camera.gateType,
                role: camera.role,
                credentials: {
                    username: camera.credentials.username,
                    password: camera.credentials.password,
                },
            });
            setIsLoading(false);
        }
    }, [camera, methods]);

    const mutation = useMutation({
        mutationFn: async (data: TCameraFormValues) => {
            if (!camera) throw new Error("Camera data not found");
            const cameraId = (camera as any).id ?? (camera as any)._id ?? (camera as any).code;
            if (!cameraId) {
                console.error("Attempting to update camera but id is missing. Camera object:", camera);
                throw new Error("Camera id is missing");
            }
            return updateCamera(cameraId, data);
        },
        onSuccess: () => {
            methods.reset();
            queryClient.invalidateQueries({ queryKey: ["cameras"] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error("Error updating camera:", error);
        },
    });

    const onSubmit = methods.handleSubmit((data: TCameraFormValues) => {
        mutation.mutate(data);
    });

    const { isValid } = methods.formState;

    const disableSubmit = !isValid;

    return {
        ...methods,
        onSubmit,
        mutation,
        disableSubmit,
        isLoading,
    };
}

export { useEditCamera };
