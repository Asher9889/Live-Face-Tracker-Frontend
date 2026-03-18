import { useForm } from "react-hook-form";
import { employeeSchema, type TEmployeeFormValues } from "../schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee, getEmployee } from "../api/employee.api";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { VisitorDTO } from "@/components/visitors/types/visitors.types";

function useRegister(onClose?: () => void, mode?: 'create' | 'create-from-unknown', unknownData?: VisitorDTO) {
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
        mutationFn: (employee: TEmployeeFormValues) => {
            // Add source and unknownId for visitor conversion
            const payload = mode === 'create-from-unknown' && unknownData
                ? {
                    ...employee,
                    source: 'unknown' as const,
                    unknownId: unknownData.id
                }
                : employee;

            return createEmployee(payload);
        },
        onSuccess: () => {
            methods.reset();
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            // Also invalidate visitors query if converting from unknown
            if (mode === 'create-from-unknown') {
                queryClient.invalidateQueries({ queryKey: ['visitors'] });
            }
            onClose?.();
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const onSubmit = methods.handleSubmit((employee: TEmployeeFormValues) => {
        mutation.mutate(employee);
    })

    const faces = methods.watch("faces");
    const { isValid } = methods.formState;

    // For visitor conversion, only require at least 1 face image
    // For regular creation, require at least 3 face images
    const disableSubmit = !isValid || !faces || faces.length < (mode === 'create-from-unknown' ? 1 : 3);

    return { ...methods, onSubmit, mutation, disableSubmit };
}

function useEmployee() {
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