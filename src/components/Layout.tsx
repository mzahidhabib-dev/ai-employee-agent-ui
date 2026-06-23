import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mail, Users, FileBarChart, Activity, CreditCard } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/emails', label: 'Emails', icon: Mail },
  { path: '/contacts', label: 'Contacts', icon: Users },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/evaluations', label: 'Evaluations', icon: Activity },
  { path: '/billing', label: 'Billing', icon: CreditCard },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nexus AI Gateway</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Agent Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
