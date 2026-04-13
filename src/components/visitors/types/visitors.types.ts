export interface VisitorPoseSample {
    imageKey?: string;
    quality?: number;
    ts?: number;
    faceSize?: {
        w?: number;
        h?: number;
    };
    embedding?: number[];
}

export interface VisitorDTO {
    eventCount: number;
    firstSeen: number;
    lastSeen: number;
    status: 'unknown' | 'converted';
    id: string;
    avatar: string;
    embeddingCount?: number;
    representativePose?: string;
    representativeQuality?: number;
    representativeImageKey?: string;
    poses?: Record<string, VisitorPoseSample>;
    poseLabels: string[];
    poseCount: number;
    bestQuality?: number;
}
