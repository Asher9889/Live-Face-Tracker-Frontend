import { useState } from "react";
import CameraList from "@/components/cameras/CameraList";
import CameraRegistrationForm from "@/components/cameras/CameraRegistrationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const Cameras = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Camera Management
        </h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Camera
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Camera</DialogTitle>
              <DialogDescription>
                Configure a new RTSP camera source.
              </DialogDescription>
            </DialogHeader>

            <CameraRegistrationForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <CameraList />
    </div>
  );
};

export default Cameras;
