import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types/profile";

interface ViewReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export const ViewReportsDialog = ({ open, onOpenChange, userId }: ViewReportsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>Medical Reports Content</div>
      </DialogContent>
    </Dialog>
  );
};