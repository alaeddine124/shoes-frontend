import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../store/slices/stocksSlice';
import { Package, Archive, AlertTriangle, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-sm text-stone-400 mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector(s => s.stocks);

  useEffect(() => { dispatch(fetchStats()); }, [dispatch]);

  if (statsLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Tableau de bord</h2>
        <p className="text-stone-400 text-sm mt-1">Vue d'ensemble de votre stock</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package}       label="Total produits"  value={stats?.total_produits ?? 0}                             color="text-blue-600"   bg="bg-blue-50"   />
        <StatCard icon={Archive}       label="Articles en stock" value={stats?.total_stock ?? 0}                              color="text-green-600"  bg="bg-green-50"  />
        <StatCard icon={AlertTriangle} label="Alertes stock"   value={stats?.alertes ?? 0}                                   color="text-red-600"    bg="bg-red-50"    />
        <StatCard icon={TrendingUp}    label="Valeur du stock" value={`${(stats?.valeur_stock ?? 0).toLocaleString()} MAD`}  color="text-amber-600"  bg="bg-amber-50"  />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">Derniers mouvements</h3>
        </div>
        <div className="divide-y divide-stone-50">
          {(stats?.mouvements_recents ?? []).length === 0 ? (
            <p className="text-center text-stone-400 py-8 text-sm">Aucun mouvement</p>
          ) : (
            (stats?.mouvements_recents ?? []).map(m => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.type === 'entree' ? 'bg-green-50' : m.type === 'sortie' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  {m.type === 'entree'
                    ? <ArrowUpCircle   size={18} className="text-green-500" />
                    : <ArrowDownCircle size={18} className="text-red-500"   />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">
                    {m.stock?.chaussure?.nom ?? '—'}
                  </p>
                  <p className="text-xs text-stone-400">{m.motif ?? m.type}</p>
                </div>
                <span className={`text-sm font-bold ${
                  m.type === 'entree' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {m.type === 'entree' ? '+' : '-'}{m.quantite}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}