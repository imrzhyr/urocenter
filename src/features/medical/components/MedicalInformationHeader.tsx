export const MedicalInformationHeader = ({ uploadCount }: { uploadCount: number }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Medical Information</h1>
      <p className="text-muted-foreground">
        Upload your medical documents ({uploadCount} uploaded)
      </p>
    </div>
  );
};