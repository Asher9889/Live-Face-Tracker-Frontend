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
import CameraListSkeleton from "./CameraListSkeleton";
import CameraEditDialog from "./CameraEditDialog";
import { useState } from "react";

interface Camera {
  id: string;
  name: string;
  code: string;
  gateType: "ENTRY" | "EXIT";
  role: "REGISTER" | "ASSIST" | "OBSERVE";
  location: string;
  rtspUrl: string;
  credentials: {
    username: string;
    password: string;
  };
}

const CameraList = () => {
  const { data: cameras = [], isLoading, isError, error } = useCamera();
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (camera: any) => {
    const normalized = {
      id: camera.id ?? camera._id ?? camera.code,
      name: camera.name,
      code: camera.code,
      gateType: camera.gateType,
      role: camera.role,
      location: camera.location,
      rtspUrl: camera.rtspUrl,
      credentials: camera.credentials ?? { username: "", password: "" },
    } as Camera;

    setEditingCamera(normalized);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingCamera(null);
  };

  if (isLoading) return <CameraListSkeleton />;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
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
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditClick(camera)}
                    >
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

      <CameraEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        camera={editingCamera}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default CameraList;
