export function convertIdToEmpId(value: string): string {
    if (!value) return 'N/A';
    return `EMP-${value.slice(-4)}`;
}