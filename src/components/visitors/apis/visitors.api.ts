import { api } from "@/config";
import endPoints from "@/config/endpoints";
import type { VisitorDTO } from "../types/visitors.types";

type RawVisitor = Record<string, any>;

const DEFAULT_POSE_ORDER = [
    "frontal",
    "left_mid",
    "left_profile",
    "right_mid",
    "right_profile",
    "upward",
];

const getMongoId = (value: unknown) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null && "$oid" in value) {
        return String((value as { $oid: string }).$oid);
    }
    return String(value);
};

const getBestQuality = (visitor: RawVisitor, poses: VisitorDTO["poses"]) => {
    const poseQualities = Object.values(poses ?? {})
        .map((pose) => pose?.quality)
        .filter((quality): quality is number => typeof quality === "number");

    const allQualities = [
        ...(typeof visitor.representativeQuality === "number" ? [visitor.representativeQuality] : []),
        ...poseQualities,
    ];

    if (allQualities.length === 0) return undefined;

    return Math.max(...allQualities);
};

const sortPoseLabels = (labels: string[]) => {
    return [...labels].sort((left, right) => {
        const leftIndex = DEFAULT_POSE_ORDER.indexOf(left);
        const rightIndex = DEFAULT_POSE_ORDER.indexOf(right);

        if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
        if (leftIndex === -1) return 1;
        if (rightIndex === -1) return -1;
        return leftIndex - rightIndex;
    });
};

const normalizeVisitor = (visitor: RawVisitor): VisitorDTO => {
    const poses =
        visitor.poses && typeof visitor.poses === "object" && !Array.isArray(visitor.poses)
            ? visitor.poses
            : {};
    const poseLabels = sortPoseLabels(Object.keys(poses));

    return {
        id: getMongoId(visitor.id ?? visitor._id),
        avatar:
            visitor.avatar ??
            visitor.preview ??
            visitor.representativeImageUrl ??
            visitor.representativeImageKey ??
            "",
        eventCount: Number(visitor.eventCount ?? 0),
        firstSeen: Number(visitor.firstSeen ?? visitor.createdAt ?? Date.now()),
        lastSeen: Number(visitor.lastSeen ?? visitor.updatedAt ?? visitor.firstSeen ?? Date.now()),
        status: visitor.status === "converted" ? "converted" : "unknown",
        embeddingCount:
            typeof visitor.embeddingCount === "number" ? visitor.embeddingCount : poseLabels.length,
        representativePose:
            typeof visitor.representativePose === "string" ? visitor.representativePose : poseLabels[0],
        representativeQuality:
            typeof visitor.representativeQuality === "number" ? visitor.representativeQuality : undefined,
        representativeImageKey:
            typeof visitor.representativeImageKey === "string" ? visitor.representativeImageKey : undefined,
        poses,
        poseLabels,
        poseCount: poseLabels.length,
        bestQuality: getBestQuality(visitor, poses),
    };
};

export async function getVisitorData():Promise<VisitorDTO[]> {
    try {
        const res = await api.request({
            url: endPoints.unknown.getAllVisitors.url,
            method: endPoints.unknown.getAllVisitors.method
        })
        const visitors = Array.isArray(res.data.data) ? res.data.data : [];
        return visitors.map(normalizeVisitor);
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || "Server Error");
        } else if (error.request) {
            throw new Error("No response received from the server. Please check your network connection.");
        } else {
            throw new Error(error.message);
        }
    }
}
