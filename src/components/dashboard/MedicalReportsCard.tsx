import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export const MedicalReportsCard = () => {
  const navigate = useNavigate();
  const [medicalReportsCount, setMedicalReportsCount] = useState(0);

  useEffect(() => {
    const fetchMedicalReports = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from('medical_reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setMedicalReportsCount(count || 0);
      }
    };

    fetchMedicalReports();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medical Reports</CardTitle>
        <CardDescription>Manage your medical documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{medicalReportsCount}</div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/medical-records")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate("/profile")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};