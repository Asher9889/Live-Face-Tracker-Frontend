export interface VisitorDTO {
    eventCount: number
    firstSeen: number,
    lastSeen: number,
    status: 'unknown' | 'converted',
    id: string,
    avatar: string
}
