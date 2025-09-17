import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const adminNavItems = [
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/communities', label: 'Communities', icon: '🏘️' },
  { href: '/admin/themes', label: 'Themes', icon: '🎨' },
  { href: '/admin/cosmetics', label: 'Cosmetics', icon: '✨' },
  { href: '/admin/reports', label: 'Reports', icon: '⚠️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user has admin privileges
  const userRole = session.user.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'MEMBER';

  if (userRole !== 'ADMIN') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground">
            Only administrators can access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-bold text-xl">
                Cozy Admin
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Welcome, {session.user.name}
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
}