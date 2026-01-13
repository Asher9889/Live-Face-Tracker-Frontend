import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { ZodLabelInput } from "../common/ZodLabelInput";
import { cameraSchema } from "./schema/camera.schema";
import { useRegisterCamera } from "./hooks/useRegisterCamera";
import { Spinner } from "../ui/spinner";

const CameraRegistrationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { register, onSubmit, setValue, formState: { errors = {} }, mutation, reset } = useRegisterCamera(onSuccess);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 w-full max-h-[calc(100vh-300px)] py-4 overflow-y-auto px-3">
        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="name">Name</ZodLabelInput>
          <div>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1" >{errors.name.message}</p>}
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="code">Code</ZodLabelInput>
          <Input {...register("code")} />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div> */}

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="code">
            Code
          </ZodLabelInput>
          <div>
            <Input id="code"
              {...register("code")}
            />

            {errors.code && (
              <p className="text-xs text-red-500">
                {errors.code.message}
              </p>
            )}
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="gateType">Gate Type</ZodLabelInput>
          <div>
            <Select onValueChange={(val) => setValue("gateType", val as "ENTRY" | "EXIT")}>
              <SelectTrigger>
                <SelectValue placeholder="Select gate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className='text-xs font-medium text-muted-foreground'>Gate type</SelectLabel>
                  <SelectItem value="ENTRY">Entry</SelectItem>
                  <SelectItem value="EXIT">Exit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.gateType && (
              <p className="text-xs mt-1 text-red-500">{errors.gateType.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="location">Location</ZodLabelInput>
          <div>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-xs mt-1 text-red-500">{errors.location.message}</p>
            )}
          </div>
        </div>

        < div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="rtspUrl">RTSP URL</ZodLabelInput>
          <div>
            <Input id="rtspurl" {...register("rtspUrl")} />
            {errors.rtspUrl && (
              <p className="text-xs mt-1 text-red-500">{errors.rtspUrl.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="credentials.username">Username</ZodLabelInput>
          <div>
            <Input id="username" {...register("credentials.username")} />
            {errors.credentials?.username && (
              <p className="text-xs text-red-500">
                {errors.credentials.username.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ZodLabelInput schema={cameraSchema} name="credentials.password">Password</ZodLabelInput>
          <div>
            <Input id="password" type="password" {...register("credentials.password")} />
            {errors.credentials?.password && (
              <p className="text-xs text-red-500">
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
        <Button disabled={mutation.isPending} onClick={() => reset()} type="button" variant="outline" >
          Cancel
        </Button>
        <Button className='w-44' disabled={mutation.isPending} type="submit">{mutation.isPending ? <Spinner /> : 'Register Camera'}</Button>

      </DialogFooter>
    </form>
  );
};

export default CameraRegistrationForm;
