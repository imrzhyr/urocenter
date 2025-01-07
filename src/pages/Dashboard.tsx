import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        
        if (!userPhone) {
          console.log("No user phone found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error || !profile) {
          console.log("No profile found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        if (profile.role === 'admin') {
          navigate("/admin", { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F0FB]">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-[#8B5CF6]">
              Welcome to Your Personal Medical Space
            </h1>
          </div>
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8 space-y-6">
              <MessagesCard />
              <div className="grid gap-6 md:grid-cols-2">
                <MedicalReportsCard />
                <RecentActivityCard />
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src="/lovable-uploads/ea4de526-e37e-4348-acf0-c64cf182a493.png"
                      alt="Dr. Ali Kamal"
                      className="rounded-full object-cover w-full h-full border-4 border-[#8B5CF6]"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#0EA5E9] text-white p-2 rounded-full">
                      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Dr. Ali Kamal</h2>
                    <p className="text-sm text-gray-600">General Practitioner</p>
                    <p className="text-xs text-[#0EA5E9] mt-1">Available for Consultation</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#8B5CF6]">15+</p>
                        <p className="text-xs text-gray-600">Years Experience</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#8B5CF6]">1000+</p>
                        <p className="text-xs text-gray-600">Patients</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;