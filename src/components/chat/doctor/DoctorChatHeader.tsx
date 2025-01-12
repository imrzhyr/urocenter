import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { PatientInfoContainer } from "../PatientInfoContainer";

export const DoctorChatHeader = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin")}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PatientInfoContainer userId={userId} />
      </div>
    </div>
  );
};