import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import AdminSidebarLayout from './AdminSidebarLayout';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check (Second Layer Defense)
    // This protects all routes under /admin even if middleware fails
    const user = await getCurrentUser();

    if (!user) {
        redirect('/admin/login');
    }

    return (
        <AdminSidebarLayout>
            {children}
        </AdminSidebarLayout>
    );
}
