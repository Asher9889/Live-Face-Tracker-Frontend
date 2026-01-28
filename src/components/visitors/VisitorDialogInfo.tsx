import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


type props = {
    visitorId : string;
    setIsDialogOpen: () => void;
    isDialogOpen: boolean;
}

const VisitorInfo = ({setIsDialogOpen, isDialogOpen}: props) => {

    //  const { data, isLoading } = useQuery({
    //     queryKey: ["visitor-details", visitorId],
    //     queryFn: () => fetchVisitorDetails(visitorId!),
    //     enabled: open && !!visitorId, // 🔑 THIS IS THE KEY
    // });

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Visitor Info</DialogTitle>
                    <DialogDescription>
                        Visitor Info
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default VisitorInfo;