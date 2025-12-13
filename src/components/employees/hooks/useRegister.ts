import { useForm } from "react-hook-form";
import { employeeSchema, type TEmployeeFormValues } from "../schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee } from "../api/employee.api";
import { useMutation } from "@tanstack/react-query";


function useRegister() {
    const methods = useForm<TEmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: "",
            email: "",
            // department: "",
            // role: "",
            faces: []
        },
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const mutation = useMutation({
        mutationFn: createEmployee,
        onError: (error) => {
            console.log(error);
        }
    })

    const onSubmit = methods.handleSubmit((employee)=> {
        mutation.mutate(employee);
    })
    return { ...methods, onSubmit, mutation };
}

export default useRegister;