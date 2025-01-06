import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SignIn = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <button 
          onClick={() => navigate("/")} 
          className="p-2 hover:bg-blue-50/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-blue-600" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 container flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90 border-blue-100">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-blue-900">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <PhoneInput value={phone} onChange={setPhone} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;