import { useForm } from "react-hook-form";
import { employeeSchema, type TEmployeeFormValues } from "../schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee, getEmployee } from "../api/employee.api";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";



function useRegister(onClose?: () => void) {
    const queryClient = useQueryClient();
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
        onSuccess: () => {
            methods.reset();
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            onClose?.();
        },
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
    const query = useInfiniteQuery({
        queryKey: ['employees'],
        queryFn: ({ pageParam }) => getEmployee({ cursor: pageParam, limit: 20 }),
        staleTime: 5 * 60 * 1000, // 5 minutes

        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.cursor : undefined;
        },
    })
    return query;
}

export { useRegister, useEmployee };