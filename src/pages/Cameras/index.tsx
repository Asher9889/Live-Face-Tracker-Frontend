import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Signal, SignalZero, AlertTriangle } from 'lucide-react';

const Cameras = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Mock data
    const cameras = [
        { id: '1', name: 'Main Entrance', url: 'rtsp://192.168.1.101/stream', status: 'online', location: 'Building A' },
        { id: '2', name: 'Lobby', url: 'rtsp://192.168.1.102/stream', status: 'online', location: 'Building A' },
        { id: '3', name: 'Parking Lot', url: 'rtsp://192.168.1.103/stream', status: 'offline', location: 'Parking' },
        { id: '4', name: 'Cafeteria', url: 'rtsp://192.168.1.104/stream', status: 'error', location: 'Building B' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return <Signal className="h-4 w-4 text-green-500" />;
            case 'offline': return <SignalZero className="h-4 w-4 text-gray-400" />;
            case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Camera Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Camera
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Camera</DialogTitle>
                            <DialogDescription>
                                Configure a new RTSP stream source.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" className="col-span-3" placeholder="e.g. Main Entrance" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="url" className="text-right">RTSP URL</Label>
                                <Input id="url" className="col-span-3" placeholder="rtsp://..." />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" className="col-span-3" placeholder="e.g. Building A" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsDialogOpen(false)}>Add Camera</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Stream URL</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cameras.map((camera) => (
                            <TableRow key={camera.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(camera.status)}
                                        <span className="capitalize text-sm text-muted-foreground">{camera.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{camera.name}</TableCell>
                                <TableCell>{camera.location}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{camera.url}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Cameras;
