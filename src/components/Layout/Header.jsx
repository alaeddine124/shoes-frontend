import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Bell, LogOut, User } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const user     = useSelector(s => s.auth.user);
  const alertes  = useSelector(s => s.stocks.items.filter(x => x.quantite <= x.seuil_alerte).length);

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-stone-800">Parkman — Gestion de Stock</h1>
        <p className="text-xs text-stone-400">Boutique de chaussures premium</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-stone-400 hover:bg-stone-100 rounded-lg">
          <Bell size={18} />
          {alertes > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {alertes}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#8B5E3C' }}>
            <User size={14} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-stone-700">{user?.name || 'Admin'}</p>
            <p className="text-xs text-stone-400">{user?.email}</p>
          </div>
          <button onClick={() => dispatch(logout())}
            className="ml-2 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}