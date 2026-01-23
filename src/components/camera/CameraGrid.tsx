import { useState } from 'react';
import { Grid2X2, Grid3X3, LayoutGrid, Square } from 'lucide-react';
import LiveCameraCard from './LiveCameraCard';
import { cn } from '@/utils/cn';
import { useAppSelector } from "@/store/hooks";


const CameraGrid = () => {
    const [layout, setLayout] = useState<1 | 2 | 3 | 4>(2);

    let cameras =  useAppSelector((state) => state.cameraEntity.ids.map((code) => {
       const cam = state.cameraEntity.byCode[code];
       const runtime = state.cameraRuntime.byCode[code];

       return {
            code: cam.code,
            name: cam.name,
            location: cam.location,
            status: runtime?.status ?? "offline",
        };
    }))
    
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Live Monitoring</h2>
                <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
                    <button
                        onClick={() => setLayout(1)}
                        className={cn("p-2 rounded-md transition-colors", layout === 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                    >
                        <Square className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setLayout(2)}
                        className={cn("p-2 rounded-md transition-colors", layout === 2 ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                    >
                        <Grid2X2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setLayout(3)}
                        className={cn("p-2 rounded-md transition-colors", layout === 3 ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setLayout(4)}
                        className={cn("p-2 rounded-md transition-colors", layout === 4 ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className={cn("grid gap-4", gridCols[layout])}>
                {cameras.map((cam) => (
                    <LiveCameraCard key={cam.code} camera={cam} />
                ))}
            </div>
        </div>
    );
};

export default CameraGrid;





