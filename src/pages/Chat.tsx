import { useEffect, useState } from "react";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { supabase } from "@/integrations/supabase/client";
import { MigrateUsers } from "@/components/auth/MigrateUsers";

const Chat = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .maybeSingle();

      setIsAdmin(profile?.role === 'admin');
    };

    checkAdminStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isAdmin && (
        <div className="max-w-sm mx-auto pt-4 px-4">
          <MigrateUsers />
        </div>
      )}
      <UserChatContainer />
      <DoctorChatContainer />
    </div>
  );
};

export default Chat;