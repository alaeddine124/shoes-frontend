import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, Package, Archive, Tag,
  Truck, ArrowLeftRight, ChevronLeft, ChevronRight,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/chaussures',   icon: Package,         label: 'Chaussures'      },
  { to: '/stocks',       icon: Archive,         label: 'Stock'           },
  { to: '/mouvements',   icon: ArrowLeftRight,  label: 'Mouvements'      },
  { to: '/categories',   icon: Tag,             label: 'Catégories'      },
  { to: '/fournisseurs', icon: Truck,           label: 'Fournisseurs'    },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const open     = useSelector(s => s.ui.sidebarOpen);

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}
      style={{ background: '#1a1a1a' }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-stone-700">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: '#8B5E3C' }}>
          <span className="text-white font-bold text-xs">P</span>
        </div>
        {open && (
          <div>
            <p className="font-bold text-sm leading-none text-white tracking-wider">PARKMAN</p>
            <p className="text-xs mt-0.5" style={{ color: '#8B5E3C' }}>Gestion de stock</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { background: '#8B5E3C' } : {}}
          >
            <Icon size={18} className="flex-shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button onClick={() => dispatch(toggleSidebar())}
        className="flex items-center justify-center py-4 border-t border-stone-700 text-stone-400 hover:text-white transition-colors">
        {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
}