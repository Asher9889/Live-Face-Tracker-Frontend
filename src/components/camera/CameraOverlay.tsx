import { motion } from 'framer-motion';

export interface BoundingBox {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
    isKnown: boolean;
}

interface CameraOverlayProps {
    boxes: BoundingBox[];
}

const CameraOverlay = ({ boxes }: CameraOverlayProps) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {boxes.map((box) => (
                <motion.div
                    key={box.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                    }}
                    className={`absolute border-2 ${box.isKnown ? 'border-green-500' : 'border-red-500'
                        }`}
                >
                    <div
                        className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-bold text-white rounded ${box.isKnown ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {box.label} ({Math.round(box.confidence * 100)}%)
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CameraOverlay;
