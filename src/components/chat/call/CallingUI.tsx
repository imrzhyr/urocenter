import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallingUIProps {
  receiverName: string;
  onCancel: () => void;
}

export const CallingUI = ({ receiverName, onCancel }: CallingUIProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <h2 className="text-[18px] font-semibold leading-6 text-white mb-2">
        {receiverName}
      </h2>
      <p className="text-[13px] leading-[16px] text-white/80 mb-8">
        Calling...
      </p>
      
      <div className="flex gap-4">
        <Button
          variant="destructive"
          size="icon"
          className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
          onClick={onCancel}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};