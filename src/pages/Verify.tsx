import { useLocation } from "react-router-dom";
import { PhoneInput } from "@/components/PhoneInput";
import { VerificationCode } from "@/components/VerificationCode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <PhoneInput value={phone} onChange={() => {}} isSignUp />
          {phone.length === 11 && (
            <VerificationCode phone={phone} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;