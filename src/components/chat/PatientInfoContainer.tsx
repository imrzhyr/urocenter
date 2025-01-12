interface PatientInfoContainerProps {
  patientName: string;
  patientId: string;
  patientPhone: string;
}

export const PatientInfoContainer = ({
  patientName,
  patientPhone
}: PatientInfoContainerProps) => {
  return (
    <div>
      <h2 className="font-medium text-white">{patientName}</h2>
      <p className="text-xs text-white/70">{patientPhone}</p>
    </div>
  );
};