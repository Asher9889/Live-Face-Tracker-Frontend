
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { employeeSchema } from './schema/employee.schema';
import { ZodLabelInput } from '../common/ZodLabelInput';
import { FilePreviewInput } from '../common';
import { useRegister } from './hooks/useRegister';
import type { TDepartment, TRole } from '@/constants';
import { Roles, Departments } from '@/constants';
import { Spinner } from '../ui/spinner';



const RegistrationForm = () => {
    const { control, onSubmit, register, setValue, formState: { errors = {}} , mutation, reset } = useRegister();

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 w-full max-h-[calc(100vh-300px)] py-4 overflow-y-auto px-3">
                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="name" className="text-left">
                        Name
                    </ZodLabelInput>
                    <div>
                        <Input id="name" {...register('name')}  className=''/>
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="email" className="text-left">
                        Email
                    </ZodLabelInput>
                    <div>
                        <Input id="email" type="email" {...register('email')} />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="department" className="text-left">
                        Department
                    </ZodLabelInput>
                    <div>
                        <Select onValueChange={(val:TDepartment) => setValue('department', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className='text-xs font-medium text-muted-foreground'>Departments</SelectLabel>
                                    {
                                        Departments.map((dep, index) => (
                                            <SelectItem key={index} value={dep}>{dep}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.department && (
                            <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="role" className="text-left">
                        Role
                    </ZodLabelInput>
                    <div>
                        <Select onValueChange={(val: TRole) => setValue('role', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className='text-xs text-left font-medium text-muted-foreground'>Roles</SelectLabel>
                                    
                                    {Roles.map((role, index) => (
                                        <SelectItem key={index} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="faces" className="text-left">
                        Face Images
                    </ZodLabelInput>
                    <FilePreviewInput name="faces" control={control} />
                </div>
            </div>
            {
                mutation.error && (
                    <p className="text-xs text-red-500 mt-1">{mutation.error.message}</p>
                )   
            }
            
            <DialogFooter>
                <Button disabled={mutation.isPending} onClick={() => reset()} type="button" variant="outline" >
                    Cancel
                </Button>
                <Button className='gap-4 mb-4' disabled={mutation.isPending} type="submit">{mutation.isPending ? <Spinner /> : 'Register Employee'}</Button>
            </DialogFooter>
        </form>
    );
};

export default RegistrationForm;
