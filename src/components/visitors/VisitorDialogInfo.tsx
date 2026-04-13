import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { envs } from "@/config";
import { Database, ScanFace, Sparkles, CalendarClock, Image as ImageIcon } from "lucide-react";
import type { VisitorDTO, VisitorPoseSample } from "./types/visitors.types";

const formatPoseLabel = (pose: string) =>
    pose
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const formatQuality = (quality?: number) => {
    if (typeof quality !== "number" || Number.isNaN(quality)) return "N/A";
    return `${Math.round(quality * 100)}%`;
};

const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
};

const formatFaceSize = (faceSize?: VisitorPoseSample["faceSize"]) => {
    if (!faceSize?.w || !faceSize?.h) return "N/A";
    return `${faceSize.w} × ${faceSize.h}px`;
};

const buildPoseImageUrl = (imageKey?: string) => {
    if (!imageKey) return "";
    if (/^https?:\/\//i.test(imageKey)) return imageKey;

    const server = envs.minioServerUrl?.replace(/\/+$/, "") ?? "";
    const bucket = envs.minioBucketName?.replace(/^\/+|\/+$/g, "") ?? "";
    const key = imageKey.replace(/^\/+/, "");

    if (!server || !bucket) return imageKey;

    return `${server}/${bucket}/${key}`;
};

type Props = {
    visitor: VisitorDTO;
};

const VisitorDialogInfo = ({ visitor }: Props) => {
    const poseEntries = visitor.poseLabels.map((label) => ({
        label,
        pose: visitor.poses?.[label],
    }));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(event) => event.stopPropagation()}
                >
                    <Database className="h-4 w-4" />
                    View Data
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="flex items-center gap-2">
                        <ScanFace className="h-5 w-5 text-primary" />
                        Unknown Identity Details
                    </DialogTitle>
                    <DialogDescription>
                        Exact pose coverage and supporting data captured for this visitor identity.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh]">
                    <div className="space-y-6 px-6 py-5">
                        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                            <div className="rounded-2xl border bg-muted/20 p-4">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <Avatar className="h-28 w-28 rounded-2xl border">
                                        <AvatarImage src={visitor.avatar} loading="lazy" />
                                        <AvatarFallback className="rounded-2xl text-lg">UNK</AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold">Identity Snapshot</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Badge variant="secondary" className="rounded-md px-2 py-1">
                                                {visitor.poseCount} pose{visitor.poseCount === 1 ? "" : "s"}
                                            </Badge>
                                            <Badge variant="outline" className="rounded-md px-2 py-1">
                                                {visitor.embeddingCount ?? 0} embeddings
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                        <ScanFace className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-[0.2em]">Best Pose</span>
                                    </div>
                                    <p className="text-base font-semibold">
                                        {visitor.representativePose ? formatPoseLabel(visitor.representativePose) : "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-[0.2em]">Best Quality</span>
                                    </div>
                                    <p className="text-base font-semibold">{formatQuality(visitor.bestQuality)}</p>
                                </div>

                                <div className="rounded-2xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                        <CalendarClock className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-[0.2em]">First Seen</span>
                                    </div>
                                    <p className="text-sm font-semibold">{formatDateTime(visitor.firstSeen)}</p>
                                </div>

                                <div className="rounded-2xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-[0.2em]">Events</span>
                                    </div>
                                    <p className="text-base font-semibold">
                                        {visitor.eventCount} capture{visitor.eventCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold">Pose Breakdown</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Exact pose-wise entries from the unknown identity payload.
                                    </p>
                                </div>
                                <Badge variant="outline" className="rounded-md px-2 py-1">
                                    {poseEntries.length} available
                                </Badge>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {poseEntries.map(({ label, pose }) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl border bg-background p-4 shadow-sm"
                                    >
                                        {(() => {
                                            const poseImageUrl = buildPoseImageUrl(pose?.imageKey);

                                            return (
                                                <>
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-semibold">{formatPoseLabel(label)}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Captured at {formatDateTime(pose?.ts)}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="rounded-md px-2 py-1">
                                                Quality {formatQuality(pose?.quality)}
                                            </Badge>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl bg-muted/30 p-3">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                    Face Size
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatFaceSize(pose?.faceSize)}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-muted/30 p-3">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                    Embedding Vector
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {pose?.embedding?.length ?? 0} values
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 rounded-xl border border-dashed p-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Pose Image
                                            </p>
                                            {poseImageUrl ? (
                                                <div className="mt-2 flex h-40 w-full items-center justify-center rounded-md border bg-muted/20 p-1">
                                                    <img
                                                        src={poseImageUrl}
                                                        alt={`${formatPoseLabel(label)} pose`}
                                                        loading="lazy"
                                                        className="h-full w-full rounded-sm object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm text-muted-foreground">N/A</p>
                                            )}
                                        </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default VisitorDialogInfo;
