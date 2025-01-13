import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Chat from '@/pages/Chat';
import UserChat from '@/pages/UserChat';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import CallPage from '@/pages/CallPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chat" element={<UserChat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/call/:userId" element={<CallPage />} />
    </Routes>
  );
};

export default AppRoutes;