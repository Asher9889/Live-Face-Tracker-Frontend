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
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle, ScanFace, Sparkles } from "lucide-react";
import useVisitorDetails from "./hooks/useVisitorDetails";
import VisitorRowSkeleton from "./VisitorTableSkeleton";
import { ImagePreviewDialog } from "../common";
import VisitorDialogInfo from "./VisitorDialogInfo";
import type { VisitorDTO } from "./types/visitors.types";

const EXPECTED_POSES = [
    "frontal",
    "right",
    "right_mid",
    "left",
    "left_mid"
    // "left_profile",
    // "right_profile",
    // "upward",
];

const formatPoseLabel = (pose: string) =>
    pose
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const formatQuality = (quality?: number) => {
    if (typeof quality !== "number" || Number.isNaN(quality)) return "N/A";
    return `${Math.round(quality * 100)}%`;
};

const IdentityCoverage = ({ visitor }: { visitor: VisitorDTO }) => {
    const visiblePoseSet = new Set([
        ...EXPECTED_POSES,
        ...visitor.poseLabels,
    ]);

    const visiblePoses = Array.from(visiblePoseSet);
    const coverageBase = Math.max(EXPECTED_POSES.length, visiblePoses.length);
    const coveragePercent =
        coverageBase > 0 ? Math.round((visitor.poseCount / coverageBase) * 100) : 0;

    return (
        <div className="min-w-[270px] space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1 rounded-md px-2 py-1 text-[11px]">
                    <ScanFace className="h-3.5 w-3.5" />
                    {visitor.poseCount} pose{visitor.poseCount === 1 ? "" : "s"}
                </Badge>
                {visitor.representativePose && (
                    <Badge variant="outline" className="rounded-md px-2 py-1 text-[11px]">
                        Best angle: {formatPoseLabel(visitor.representativePose)}
                    </Badge>
                )}
                <Badge variant="outline" className="gap-1 rounded-md px-2 py-1 text-[11px]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Quality {formatQuality(visitor.bestQuality)}
                </Badge>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Pose coverage</span>
                    <span>{coveragePercent}% mapped</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${coveragePercent}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {visiblePoses.map((pose) => {
                    const isAvailable = visitor.poseLabels.includes(pose);

                    return (
                        <span
                            key={pose}
                            className={[
                                "rounded-full border px-2 py-1 text-[11px] font-medium transition-colors",
                                isAvailable
                                    ? "border-primary/25 bg-primary/10 text-primary"
                                    : "border-border bg-muted/50 text-muted-foreground",
                            ].join(" ")}
                        >
                            {formatPoseLabel(pose)}
                        </span>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{visitor.embeddingCount ?? 0} embeddings</span>
                <span>{visitor.eventCount} event{visitor.eventCount === 1 ? "" : "s"}</span>
            </div>
        </div>
    );
};

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
                        <TableHead>Status</TableHead>
                        <TableHead>Identity Data</TableHead>
                        <TableHead>First Seen</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({ length: 5 }).map((_, index) => (
                        <VisitorRowSkeleton key={index} />
                    )) : data?.map((visitor) => {
                        const isSelected = selectedIds.includes(visitor.id);
                        const isConverted = visitor.status === 'converted';

                        return (
                            <TableRow
                                key={visitor.id}
                                className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-primary/10' : ''} ${isConverted ? 'opacity-60' : ''}`}
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
                                            disabled={isMerging || isConverted}
                                            aria-label={`Select visitor ${visitor.id}`}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <ImagePreviewDialog src={visitor.avatar} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {isConverted ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium text-green-700">Converted</span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-medium text-muted-foreground">Unknown</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <IdentityCoverage visitor={visitor} />
                                </TableCell>
                                <TableCell>{new Date(visitor.firstSeen).toLocaleString()}</TableCell>
                                <TableCell>{new Date(visitor.lastSeen).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {!isSelectionMode && <VisitorDialogInfo visitor={visitor} />}
                                        {!isSelectionMode && !isConverted && (
                                            <Button size="sm" className="gap-2" onClick={(e) => handleConvertToUser(visitor, e)}>
                                                <UserPlus className="h-4 w-4" />
                                                Convert to User
                                            </Button>
                                        )}
                                        {isConverted && (
                                            <Button size="sm" variant="outline" disabled className="gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                Already Converted
                                            </Button>
                                        )}
                                    </div>
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
