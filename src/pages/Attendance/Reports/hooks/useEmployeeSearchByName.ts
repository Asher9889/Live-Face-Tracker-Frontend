import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeNames } from "../api/report.api";

export interface EmployeeSearchItem {
    id: string;
    name: string;
    department: string;
    role: string;
}


const useEmployeeSearchByName = (searchTerm: string) => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            window.clearTimeout(timer);
        };
    }, [searchTerm]);

    const query = debouncedSearchTerm.trim();

    const { data: employees = [], isLoading, isError, isFetched } = useQuery({
        queryKey: ['employeeSearch', query],
        queryFn: () => fetchEmployeeNames(query),
        enabled: query.length >= 2,
        staleTime: 60 * 1000,
    });

    return { employees, isLoading, isError, isFetched };
};

export default useEmployeeSearchByName;