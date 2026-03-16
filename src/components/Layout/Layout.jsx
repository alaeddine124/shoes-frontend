import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header  from './Header';

export default function Layout() {
  const open = useSelector(s => s.ui.sidebarOpen);
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${open ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}