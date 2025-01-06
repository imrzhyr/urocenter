import { useState, useEffect } from "react";
import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDialog } from "@/components/medical-reports/UploadDialog";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { UploadInformationDialog } from "@/components/medical-reports/UploadInformationDialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const MedicalReportsCard = () => {
  const [medicalReportsCount, setMedicalReportsCount] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchMedicalReports = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to view medical reports");
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profileData) {
        toast.error("Profile not found");
        return;
      }

      const { data: reports, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', profileData.id);

      if (error) throw error;

      setMedicalReportsCount(reports?.length || 0);
    } catch (error) {
      toast.error("Failed to fetch medical reports");
    }
  };

  useEffect(() => {
    fetchMedicalReports();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Medical Reports</CardTitle>
            <CardDescription>Manage your medical documents</CardDescription>
          </div>
          <UploadInformationDialog />
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold">{medicalReportsCount}</div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsViewDialogOpen(true)}
                className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
                className="transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <UploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onUploadSuccess={fetchMedicalReports}
      />

      <ViewReportsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </motion.div>
  );
};