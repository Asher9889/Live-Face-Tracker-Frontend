import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";
import useVisitorDetails from "./hooks/useVisitorDetails";
import VisitorRowSkeleton from "./VisitorTableSkeleton";
import { ImagePreviewDialog } from "../common";
import type { VisitorDTO } from "./types/visitors.types";

interface VisitorTableProps {
    selectedIds?: string[];
    onSelectionChange?: (id: string) => void;
    isMerging?: boolean;
    onConvertToUser?: (visitor: VisitorDTO) => void;
}

const VisitorTable = ({ selectedIds = [], onSelectionChange, isMerging = false, onConvertToUser }: VisitorTableProps) => {
    const { data, isLoading } = useVisitorDetails();

    const isSelectionMode = selectedIds.length > 0;

    const handleRowClick = (visitorId: string, event: React.MouseEvent) => {
        if (isMerging) return;
        // Only toggle selection if clicking the row directly (not actions/images)
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="dialog"]')) {
            return;
        }

        if (onSelectionChange) {
            onSelectionChange(visitorId);
        }
    };

    const handleConvertToUser = (visitor: VisitorDTO, event: React.MouseEvent) => {
        event.stopPropagation();
        onConvertToUser?.(visitor);
    };

    return (
        <div className="rounded-md border relative overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {onSelectionChange && <TableHead className="w-[50px]"></TableHead>}
                        <TableHead>Snapshot</TableHead>
                        <TableHead>First Seen</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Occurrences</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({ length: 5 }).map((_, index) => (
                        <VisitorRowSkeleton key={index} />
                    )) : data?.map((visitor) => {
                        const isSelected = selectedIds.includes(visitor.id);

                        return (
                            <TableRow
                                key={visitor.id}
                                className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-primary/10' : ''}`}
                                onClick={(e) => handleRowClick(visitor.id, e)}
                            >
                                {onSelectionChange && (
                                    <TableCell>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => {
                                                if (!isMerging && onSelectionChange) {
                                                    onSelectionChange(visitor.id);
                                                }
                                            }}
                                            disabled={isMerging}
                                            aria-label={`Select visitor ${visitor.id}`}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <ImagePreviewDialog src={visitor.avatar} />
                                </TableCell>
                                <TableCell>{new Date(visitor.firstSeen).toLocaleString()}</TableCell>
                                <TableCell>{new Date(visitor.lastSeen).toLocaleString()}</TableCell>
                                <TableCell>{visitor.eventCount}</TableCell>
                                <TableCell className="text-right">
                                    {!isSelectionMode && (
                                        <Button size="sm" className="gap-2" onClick={(e) => handleConvertToUser(visitor, e)}>
                                            <UserPlus className="h-4 w-4" />
                                            Convert to User
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default VisitorTable;
