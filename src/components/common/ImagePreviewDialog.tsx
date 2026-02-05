import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  src: string;
}

export default function ImagePreviewDialog({ src }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="outline-none"
        >
          <Avatar className="h-12 w-12 rounded-md transition-transform duration-200 hover:scale-105">
            <AvatarImage src={src} loading="lazy" />
            <AvatarFallback>UNK</AvatarFallback>
          </Avatar>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md border-none bg-transparent shadow-none p-0">
        {/* Accessible metadata (screen readers) */}
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <DialogDescription className="sr-only">
          Enlarged visitor snapshot image
        </DialogDescription>

        <div className="flex items-center justify-center">
          <img
            src={src}
            alt="preview"
            className="rounded-xl object-contain max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
