import { Routes, Route } from "react-router-dom";
import Chat from "@/pages/Chat";
import UserChat from "@/pages/UserChat";
import { CallPage } from "@/components/call/CallPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/user-chat" element={<UserChat />} />
      <Route path="/call/:userId" element={<CallPage />} />
    </Routes>
  );
};