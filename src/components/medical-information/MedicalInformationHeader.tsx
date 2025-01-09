interface MedicalInformationHeaderProps {
  uploadCount: number;
}

export const MedicalInformationHeader = ({ uploadCount }: MedicalInformationHeaderProps) => {
  return (
    <div className="space-y-2 bg-white">
      <h1 className="text-2xl font-semibold tracking-tight">
        Medical Information
      </h1>
      <p className="text-muted-foreground">
        Upload your medical documents and reports
        {uploadCount > 0 && ` (${uploadCount} files uploaded)`}
      </p>
    </div>
  );
};