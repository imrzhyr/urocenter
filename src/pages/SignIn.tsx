import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientBackground } from "@/components/backgrounds/GradientBackground";

const SignIn = () => {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen relative flex flex-col">
      <GradientBackground />
      
      <div className="p-4 flex justify-end relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-white/20 backdrop-blur-sm">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 container flex items-center justify-center py-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-md bg-white/80 border-blue-100/50 shadow-xl">
            <CardHeader className="space-y-3 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-12">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-blue-900 mt-4">Welcome Back</h1>
              <p className="text-blue-600/80 text-sm">
                Sign in to continue to your account
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="backdrop-blur-sm bg-white/50 rounded-lg p-6">
                <PhoneInput value={phone} onChange={setPhone} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="relative z-10 p-4 text-center text-sm text-blue-600/60 backdrop-blur-sm">
        © 2024 All rights reserved
      </footer>
    </div>
  );
};

export default SignIn;