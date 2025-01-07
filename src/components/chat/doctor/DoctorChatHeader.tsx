import { PatientInfoCard } from "../PatientInfoCard";

interface DoctorChatHeaderProps {
  patientId?: string;
}

export const DoctorChatHeader = ({ patientId }: DoctorChatHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <PatientInfoCard patientId={patientId} />
    </div>
  );
};