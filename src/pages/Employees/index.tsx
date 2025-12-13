import { useState } from 'react';
import EmployeeList from '@/components/employees/EmployeeList';
import RegistrationForm from '@/components/employees/RegistrationForm';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const Employees = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Employee Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-xl'>
                        <DialogHeader>
                            <DialogTitle>Register New Employee</DialogTitle>
                            <DialogDescription>
                                Add a new employee to the system. This will also register their face for recognition.
                            </DialogDescription>
                        </DialogHeader>
                        <RegistrationForm />
                    </DialogContent>
                </Dialog>
            </div>

            <EmployeeList />
        </div>
    );
};

export default Employees;
