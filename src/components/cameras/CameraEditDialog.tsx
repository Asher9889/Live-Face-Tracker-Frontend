import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { ZodLabelInput } from "../common/ZodLabelInput";
import { cameraSchema } from "./schema/camera.schema";
import { useEditCamera } from "./hooks/useEditCamera";
import { Spinner } from "../ui/spinner";

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

interface CameraEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    camera: Camera | null;
    onSuccess?: () => void;
}

const CameraEditDialog = ({open, onOpenChange, camera, onSuccess}: CameraEditDialogProps) => {
    const { register, onSubmit, setValue, formState: { errors = {} }, mutation, reset, isLoading } = useEditCamera(camera, onSuccess);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
        }
        onOpenChange(isOpen);
    };

    if (!camera) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Camera</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 w-full max-h-[calc(100vh-300px)] py-4 overflow-y-auto px-3">
                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="name">
                                Name
                            </ZodLabelInput>
                            <div>
                                <Input id="name" {...register("name")} />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="code">
                                Code
                            </ZodLabelInput>
                            <div>
                                <Input id="code" {...register("code")} disabled />
                                {errors.code && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.code.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="gateType">
                                Gate Type
                            </ZodLabelInput>
                            <div>
                                <Select
                                    onValueChange={(val) =>
                                        setValue("gateType", val as "ENTRY" | "EXIT")
                                    }
                                    defaultValue={camera.gateType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gate type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel className="text-xs font-medium text-muted-foreground">
                                                Gate type
                                            </SelectLabel>
                                            <SelectItem value="ENTRY">Entry</SelectItem>
                                            <SelectItem value="EXIT">Exit</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.gateType && (
                                    <p className="text-xs mt-1 text-red-500">
                                        {errors.gateType.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="role">
                                Camera Role
                            </ZodLabelInput>
                            <div>
                                <Select
                                    onValueChange={(val) =>
                                        setValue("role", val as "REGISTER" | "ASSIST" | "OBSERVE")
                                    }
                                    defaultValue={camera.role}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select camera role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel className="text-xs font-medium text-muted-foreground">
                                                Camera role
                                            </SelectLabel>
                                            <SelectItem value="REGISTER">Register</SelectItem>
                                            <SelectItem value="ASSIST">Assist</SelectItem>
                                            <SelectItem value="OBSERVE">Observe</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-xs mt-1 text-red-500">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="location">
                                Location
                            </ZodLabelInput>
                            <div>
                                <Input id="location" {...register("location")} />
                                {errors.location && (
                                    <p className="text-xs mt-1 text-red-500">
                                        {errors.location.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="rtspUrl">
                                RTSP URL
                            </ZodLabelInput>
                            <div>
                                <Input id="rtspurl" {...register("rtspUrl")} />
                                {errors.rtspUrl && (
                                    <p className="text-xs mt-1 text-red-500">
                                        {errors.rtspUrl.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="credentials.username">
                                Username
                            </ZodLabelInput>
                            <div>
                                <Input id="username" {...register("credentials.username")} />
                                {errors.credentials?.username && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.credentials.username.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ZodLabelInput schema={cameraSchema} name="credentials.password">
                                Password
                            </ZodLabelInput>
                            <div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("credentials.password")}
                                />
                                {errors.credentials?.password && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.credentials.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {mutation.error && (
                        <p className="text-xs text-red-500">{mutation.error.message}</p>
                    )}

                    <DialogFooter>
                        <Button
                            disabled={mutation.isPending || isLoading}
                            onClick={() => handleOpenChange(false)}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-44"
                            disabled={mutation.isPending || isLoading}
                            type="submit"
                        >
                            {mutation.isPending || isLoading ? <Spinner /> : "Update Camera"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CameraEditDialog;
