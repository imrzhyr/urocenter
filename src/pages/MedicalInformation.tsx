import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { ComplaintInput } from "@/components/medical-reports/ComplaintInput";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MedicalInformation = () => {
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState("");

  const handleNext = () => {
    navigate("/payment");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col justify-center space-y-6"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="space-y-6">
          <ComplaintInput value={complaint} onChange={setComplaint} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              onClick={() => {}}
            >
              <Camera className="w-4 h-4" />
              <span>Take Picture</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              onClick={() => {}}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Files</span>
            </Button>
          </div>

          <Button 
            className="w-full"
            onClick={handleNext}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MedicalInformation;