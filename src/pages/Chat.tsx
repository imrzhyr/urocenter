import { useProfile } from "@/hooks/useProfile";
import { Suspense, lazy } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import React from "react";
import { Navigate } from "react-router-dom";

// Lazy load containers directly from their source files
const UserChat = React.lazy(() => import("@/components/chat/containers/UserChat"));
const DoctorChat = React.lazy(() => import("@/components/chat/containers/DoctorChat"));

const Chat = () => {
  const { profile } = useProfile();

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingScreen />}>
        {profile.role === 'admin' ? (
          <Navigate to="/admin" replace />
        ) : (
          <UserChat />
        )}
      </Suspense>
    </div>
  );
};

export default Chat;