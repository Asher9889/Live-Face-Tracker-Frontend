import { useForm } from "react-hook-form";
import { employeeSchema, type TEmployeeFormValues } from "../schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee, getEmployee } from "../api/employee.api";
import { useMutation, useQuery } from "@tanstack/react-query";


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

    const onSubmit = methods.handleSubmit((employee:TEmployeeFormValues)=> {
        mutation.mutate(employee);
    })

    const faces = methods.watch("faces");
    const { isValid } = methods.formState;

    const disableSubmit = !isValid || !faces || faces.length < 3;

    return { ...methods, onSubmit, mutation, disableSubmit };
}

function useEmployee(){
    const query = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployee,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
    return query;
}

export {useRegister, useEmployee};