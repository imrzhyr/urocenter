import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressSteps } from "@/components/ProgressSteps";
import { MedicalReportUpload } from "@/components/medical-reports/MedicalReportUpload";

const MedicalInformation = () => {
  const navigate = useNavigate();
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container max-w-4xl py-8">
        <ProgressSteps steps={steps} currentStep={2} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 mt-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Medical Documentation</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Help us provide you with the best care by sharing your medical history and reports.
              Your information is secure and will only be accessed by your healthcare provider.
            </p>
          </div>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Important Documents</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Previous Medical Reports</li>
                <li>• Laboratory Test Results</li>
                <li>• X-rays and Imaging</li>
                <li>• Prescriptions</li>
                <li>• Treatment History</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Upload Your Documents</h3>
              <MedicalReportUpload />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/payment")}
              className="group"
            >
              Continue to Payment
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicalInformation;