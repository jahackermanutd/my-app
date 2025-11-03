// Letter Management System Main Page
'use client';

import React from 'react';
import { useAuth } from './lib/AuthContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import WriterDashboard from './components/WriterDashboard';
import SigneeDashboard from './components/SigneeDashboard';

const Page = () => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, show login page
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Route user to their role-specific dashboard
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'letter_writer':
      return <WriterDashboard />;
    case 'signee':
      return <SigneeDashboard />;
    default:
      return <LoginPage />;
  }
};

export default Page;
