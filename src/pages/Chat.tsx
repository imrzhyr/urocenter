import { useProfile } from "@/hooks/useProfile";
import { Suspense, lazy } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import React from "react";

// Lazy load containers for better performance
const UserChat = React.lazy(() =>
  import("@/components/chat/containers").then(module => ({ default: module.UserChat }))
);

const DoctorChat = React.lazy(() =>
  import("@/components/chat/containers").then(module => ({ default: module.DoctorChat }))
);

const Chat = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingScreen />}>
        {profile?.role === 'admin' ? (
          <DoctorChat />
        ) : (
          <UserChat />
        )}
      </Suspense>
    </div>
  );
};

export default Chat;