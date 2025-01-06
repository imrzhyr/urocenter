import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SignUpHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 flex justify-between items-center relative z-10">
      <button 
        onClick={() => navigate("/")} 
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
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
  );
};