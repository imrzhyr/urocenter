import { motion } from "framer-motion";

interface MedicalInformationHeaderProps {
  uploadCount: number;
}

export const MedicalInformationHeader = ({ uploadCount }: MedicalInformationHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Medical Information</h1>
      <p className="text-muted-foreground">
        Please upload your medical documents or take pictures
      </p>
      {uploadCount > 0 && (
        <p className="text-sm text-primary font-medium">
          {uploadCount} file{uploadCount !== 1 ? 's' : ''} uploaded successfully
        </p>
      )}
    </div>
  );
};