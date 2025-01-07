import { motion } from "framer-motion";
import { Calendar, Clock, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DoctorProfileCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          <img
            src="/lovable-uploads/7ac98ca7-e043-4da5-afac-f986ff382bcf.png"
            alt="Dr. Ali Kamal in Surgery"
            className="rounded-full object-cover w-full h-full border-4 border-primary"
          />
          <div className="absolute -bottom-2 -right-2 bg-[#0EA5E9] text-white p-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dr. Ali Kamal</h2>
          <p className="text-sm text-primary">Urologist & General Surgeon</p>
          <p className="text-xs text-[#0EA5E9] mt-1">Available for Consultation</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Award className="w-4 h-4 mr-1" />
            </div>
            <p className="text-2xl font-bold text-primary">15+</p>
            <p className="text-xs text-gray-600">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Star className="w-4 h-4 mr-1" />
            </div>
            <p className="text-2xl font-bold text-primary">4.9</p>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>Available Mon-Fri</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span>9:00 AM - 5:00 PM</span>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/chat')}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          Start Consultation
        </Button>
      </div>
    </motion.div>
  );
};