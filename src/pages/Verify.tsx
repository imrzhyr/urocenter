import { useState } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { VerificationCode } from "@/components/VerificationCode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Verify = () => {
  const [phone, setPhone] = useState("");

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhoneInput value={phone} onChange={setPhone} />
          {phone.length === 10 && (
            <VerificationCode phone={phone} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;