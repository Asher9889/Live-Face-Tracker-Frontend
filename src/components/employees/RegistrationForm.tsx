import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

const employeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    department: z.string().min(1, 'Department is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    role: z.string().min(1, 'Role is required'),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface RegistrationFormProps {
    onSubmit: (data: EmployeeFormValues) => void;
    onCancel: () => void;
}

const RegistrationForm = ({ onSubmit, onCancel }: RegistrationFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <div className="col-span-3">
                        <Input id="name" {...register('name')} />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employeeId" className="text-right">
                        ID
                    </Label>
                    <div className="col-span-3">
                        <Input id="employeeId" {...register('employeeId')} />
                        {errors.employeeId && (
                            <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                        Dept
                    </Label>
                    <div className="col-span-3">
                        <Select onValueChange={(val) => setValue('department', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.department && (
                            <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                        Phone
                    </Label>
                    <div className="col-span-3">
                        <Input id="phone" {...register('phone')} />
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                        Role
                    </Label>
                    <div className="col-span-3">
                        <Select onValueChange={(val) => setValue('role', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Register Employee</Button>
            </DialogFooter>
        </form>
    );
};

export default RegistrationForm;
