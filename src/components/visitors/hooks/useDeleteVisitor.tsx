import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVisitor } from "../apis/visitors.api";
import { toast } from "sonner";

export function useDeleteVisitor() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (visitorId: string) => deleteVisitor(visitorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visitors'] });
            toast.success("Visitor deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete visitor");
        }
    });

    return mutation;
}