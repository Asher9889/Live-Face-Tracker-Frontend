import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
// import { useState } from "react";

const VisitorTable = () => {

    // const [isDialogOpen, setIsDialogOpen] = useState<Boolean>(false);

    // Mock data
    const visitors = Array.from({ length: 5 }).map((_, i) => ({
        id: i.toString(),
        image: `https://i.pravatar.cc/150?u=${i + 20}`,
        firstSeen: new Date(Date.now() - Math.random() * 10000000).toLocaleString(),
        lastSeen: new Date().toLocaleString(),
        occurrences: Math.floor(Math.random() * 10) + 1,
        location: `Camera ${Math.floor(Math.random() * 4) + 1}`,
    }));

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Snapshot</TableHead>
                        <TableHead>First Seen</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Occurrences</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visitors.map((visitor) => (
                        <TableRow key={visitor.id} className="cursor-pointer" >
                            <TableCell>
                                <Avatar className="h-12 w-12 rounded-md">
                                    <AvatarImage src={visitor.image} />
                                    <AvatarFallback>UNK</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{visitor.firstSeen}</TableCell>
                            <TableCell>{visitor.lastSeen}</TableCell>
                            <TableCell>{visitor.occurrences}</TableCell>
                            <TableCell>{visitor.location}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Convert to User
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default VisitorTable;
