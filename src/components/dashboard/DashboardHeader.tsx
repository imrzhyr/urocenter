interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-blue-900">{title}</h1>
      <p className="text-lg text-blue-600 mt-2">{subtitle}</p>
    </div>
  );
};