import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { HealthTipsCard } from "@/components/dashboard/HealthTipsCard";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { motion } from "framer-motion";

const Dashboard = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <DashboardHeader />
      <main className="container mx-auto p-4 space-y-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <MessagesCard />
          <MedicalReportsCard />
          <AppointmentCard />
          <HealthTipsCard />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;