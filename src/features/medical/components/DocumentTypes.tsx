import { DocumentTypeCard } from "./DocumentTypeCard";

export const DocumentTypes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DocumentTypeCard title="Medical Reports" description="Upload your medical reports and test results" />
      <DocumentTypeCard title="Prescriptions" description="Upload your prescriptions" />
      <DocumentTypeCard title="X-Rays" description="Upload your X-rays and imaging results" />
    </div>
  );
};