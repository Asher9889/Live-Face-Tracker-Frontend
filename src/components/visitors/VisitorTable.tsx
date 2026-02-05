import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import useVisitorDetails from "./hooks/useVisitorDetails";
import VisitorRowSkeleton from "./VisitorTableSkeleton";
import { ImagePreviewDialog } from "../common";

// import { useState } from "react";

const VisitorTable = () => {

    // const [isDialogOpen, setIsDialogOpen] = useState<Boolean>(false);

    const { data, isLoading } = useVisitorDetails()

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Snapshot</TableHead>
                        <TableHead>First Seen</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Occurrences</TableHead>
                        {/* <TableHead>Location</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({ length: 5 }).map((_, index) => (
                        <VisitorRowSkeleton key={index} />
                    )) : data?.map((visitor) => (
                        <TableRow key={visitor.id} className="cursor-pointer" >
                            <TableCell>
                                <ImagePreviewDialog src={visitor.avatar} />
                            </TableCell>
                            <TableCell>{new Date(visitor.firstSeen).toLocaleString()}</TableCell>
                            <TableCell>{new Date(visitor.lastSeen).toLocaleString()}</TableCell>
                            <TableCell>{visitor.eventCount}</TableCell>
                            {/* <TableCell>Test</TableCell> */}
                            <TableCell className="text-right">
                                <Button size="sm" className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Convert to User
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default VisitorTable;
