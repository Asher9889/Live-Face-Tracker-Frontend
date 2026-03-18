
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
import type { VisitorDTO } from '@/components/visitors/types/visitors.types';
import { useEffect } from 'react';

type RegistrationFormProps = {
    onClose: () => void;
    mode?: 'create' | 'create-from-unknown';
    unknownData?: VisitorDTO;
};

const RegistrationForm = ({ onClose, mode = 'create', unknownData }: RegistrationFormProps) => {
    const { control, onSubmit, register, setValue, formState: { errors = {} }, mutation, reset } = useRegister(onClose, mode, unknownData);

    useEffect(() => {
        if (mode === 'create-from-unknown' && unknownData) {
            // Pre-fill face images from visitor data
            // Convert visitor avatar to File object for the form
            fetch(unknownData.avatar)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `visitor-${unknownData.id}.jpg`, { type: 'image/jpeg' });
                    setValue('faces', [file]);
                })
                .catch(err => console.error('Failed to fetch visitor image:', err));
        }
    }, [mode, unknownData, setValue]);

    // Show optional info for visitor conversion
    const showVisitorInfo = mode === 'create-from-unknown' && unknownData;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {showVisitorInfo && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Visitor Information</h4>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                            <span className="font-medium">First Seen:</span>
                            <p>{new Date(unknownData.firstSeen).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-medium">Last Seen:</span>
                            <p>{new Date(unknownData.lastSeen).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-medium">Occurrences:</span>
                            <p>{unknownData.eventCount}</p>
                        </div>
                    </div>
                    {unknownData.eventCount < 2 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                            ⚠️ Low confidence face data. Consider to wait more Occurrences.
                        </div>
                    )}
                </div>
            )}
            <div className="grid gap-4 w-full max-h-[calc(100vh-300px)] py-4 overflow-y-auto px-3">
                <div className="flex flex-col gap-2">
                    <ZodLabelInput schema={employeeSchema} name="name" className="text-left">
                        Name
                    </ZodLabelInput>
                    <div>
                        <Input id="name" {...register('name')} className='' />
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
                        <Select onValueChange={(val: TDepartment) => setValue('department', val)}>
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
                <Button className='w-44' disabled={mutation.isPending} type="submit">{mutation.isPending ? <Spinner /> : 'Register Employee'}</Button>
            </DialogFooter>
        </form>
    );
};

export default RegistrationForm;
