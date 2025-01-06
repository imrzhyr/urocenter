import { useLocation } from "react-router-dom";
import { VerificationCode } from "@/components/VerificationCode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Phone } from "lucide-react";

const Verify = () => {
  const location = useLocation();
  const phone = (location.state?.phone || "").replace("+964", "");

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {phone && (
            <>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Great! We've sent a verification code to your phone number. Please check your messages and enter the code below along with your desired password to complete the signup process. 🚀
                </AlertDescription>
              </Alert>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+964 {phone}</span>
              </div>
            </>
          )}
          {phone.length === 11 && (
            <VerificationCode phone={phone} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;