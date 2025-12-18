import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { ZodLabelInput } from "../common/ZodLabelInput";
import { cameraSchema } from "./schema/camera.schema";
import { useRegisterCamera } from "./hooks/useRegisterCamera";
import { Spinner } from "../ui/spinner";

const CameraRegistrationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    register,
    onSubmit,
    setValue,
    formState: { errors },
    mutation,
  } = useRegisterCamera(onSuccess);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 w-full max-h-[calc(100vh-300px)] py-4 overflow-y-auto px-3">
                <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="name">Name</ZodLabelInput>
          <Input {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

                <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="code">Code</ZodLabelInput>
          <Input {...register("code")} />
        </div>

                <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="gateType">Gate Type</ZodLabelInput>
          <Select onValueChange={(val) => setValue("gateType", val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTRY">ENTRY</SelectItem>
              <SelectItem value="EXIT">EXIT</SelectItem>
            </SelectContent>
          </Select>
        </div>

                <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="location">Location</ZodLabelInput>
          <Input {...register("location")} />
        </div>

        < div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="rtspUrl">RTSP URL</ZodLabelInput>
          <Input {...register("rtspUrl")} />
        </div>

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="credentials.username">Username</ZodLabelInput>
          <Input {...register("credentials.username")} />
        </div>

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="credentials.password">Password</ZodLabelInput>
          <Input type="password" {...register("credentials.password")} />
        </div>
      </div>

      {mutation.error && (
        <p className="text-xs text-red-500">{mutation.error.message}</p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner /> : "Add Camera"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CameraRegistrationForm;
