// We're keeping this as a server component
// because the dynamic import is client-side only
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

// Dynamically import AdminLayout for better code splitting
// This component is only loaded when the admin routes are accessed
const AdminLayout = dynamic(
  () => import('@/components/admin/AdminLayout'),
  {
    loading: () => <AdminLayoutSkeleton />,
    // Don't server-render this component to reduce SSR payload
    ssr: false
  }
);

// Placeholder loading skeleton for admin layout
function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 bg-muted border-b px-6 flex items-center">
        <Skeleton className="h-6 w-32" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-64 border-r bg-muted p-4 hidden lg:block">
          <Skeleton className="h-5 w-full mt-6 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProtectedRoute>
      <Suspense fallback={<AdminLayoutSkeleton />}>
        <AdminLayout>{children}</AdminLayout>
      </Suspense>
    </AdminProtectedRoute>
  );
} 