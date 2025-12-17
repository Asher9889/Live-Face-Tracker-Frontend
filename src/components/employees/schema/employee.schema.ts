import { Departments, Roles } from '@/constants';
import { z } from 'zod';

export const employeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email({ error: ' Provide valid email address' }),
    department: z.enum(Departments, {error: `Please select a department`}),
    role: z.enum(Roles, {error: `Please select a role`}),
    faces: z
        .custom<File[]>()
        .refine((files) => files?.length > 0, 'Please select at least three face image')
        .refine((files) => files?.length <= 10, 'Maximum 10 face images allowed')
        .refine(
            (files) => Array.from(files).every((file) => file.type.startsWith('image/')),
            'Only image files are allowed'
        ),
});

export type TEmployeeFormValues = z.infer<typeof employeeSchema>;