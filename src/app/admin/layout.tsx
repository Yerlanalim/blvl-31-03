'use client';

import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { AdminLayout } from '@/components/admin';
import React from 'react';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 