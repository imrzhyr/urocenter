import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const SignIn = () => {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="p-4 flex justify-end relative z-10">
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
      
      <div className="flex-1 container flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-3 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-12">
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
              <CardTitle className="text-2xl font-semibold text-primary mt-4">Welcome Back</CardTitle>
              <p className="text-muted-foreground text-sm">
                Sign in to continue to your account
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg p-6">
                <PhoneInput value={phone} onChange={setPhone} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 All rights reserved
      </footer>
    </div>
  );
};

export default SignIn;