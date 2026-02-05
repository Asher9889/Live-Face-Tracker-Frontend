import { useQuery } from "@tanstack/react-query";
import { getVisitorData } from "../apis/visitors.api";

function useVisitorDetails(){

    const query = useQuery({
        queryKey: ["visitors"],
        queryFn: getVisitorData,
        staleTime: 1 * 60 * 1000, // 5 minutes
    })
    return query;
}

export default useVisitorDetails;