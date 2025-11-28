declare module 'jsmpeg' {
    export class Player {
        constructor(url: string, options: { canvas: HTMLCanvasElement; autoplay?: boolean; audio?: boolean; loop?: boolean });
        destroy(): void;
    }
}
