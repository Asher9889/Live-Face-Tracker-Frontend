import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useCamera } from "./hooks/useRegisterCamera";

const CameraList = () => {
  const { data: cameras = [], isLoading, isError, error } = useCamera();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Gate Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>RTSP URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cameras.map((camera: any) => (
            <TableRow key={camera.id}>
              <TableCell className="font-medium">{camera.name}</TableCell>
              <TableCell>{camera.code}</TableCell>
              <TableCell>{camera.gateType}</TableCell>
              <TableCell>{camera.location}</TableCell>
              <TableCell className="font-mono text-xs">
                {camera.rtspUrl}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CameraList;
