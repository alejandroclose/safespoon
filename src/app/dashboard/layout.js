// src/app/dashboard/layout.js
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function DashboardRootLayout({ children }) {
  // Check if user is authenticated on the server
  const session = await getServerSession(authOptions);
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }
  
  // Determine allowed roles for dashboard
  const allowedRoles = ['admin', 'establishment_owner', 'establishment_staff'];
  
  // If user role is not allowed, redirect to unauthorized page
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized');
  }
  
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}