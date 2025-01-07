import { PatientInfoContainer } from "../PatientInfoContainer";

interface DoctorChatHeaderProps {
  patientId?: string;
}

export const DoctorChatHeader = ({ patientId }: DoctorChatHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <PatientInfoContainer patientId={patientId} />
    </div>
  );
};