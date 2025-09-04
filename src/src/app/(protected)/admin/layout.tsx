import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/lib/auth/checkAdminAccess';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await checkAdminAccess();

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-600 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                Admin Panel
              </h2>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                You have administrative access to manage cosmetics
              </p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}