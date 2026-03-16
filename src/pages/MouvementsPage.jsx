import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../store/slices/stocksSlice';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';

export default function MouvementsPage() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector(s => s.stocks);

  useEffect(() => { dispatch(fetchStats()); }, [dispatch]);

  const mouvements = stats?.mouvements_recents ?? [];

  const icon = type =>
    type === 'entree'     ? <ArrowUpCircle   size={18} className="text-green-500" /> :
    type === 'sortie'     ? <ArrowDownCircle size={18} className="text-red-500"   /> :
                            <RefreshCw       size={18} className="text-blue-500"  />;

  const badge = type =>
    type === 'entree'     ? 'bg-green-50 text-green-700' :
    type === 'sortie'     ? 'bg-red-50 text-red-700'     :
                            'bg-blue-50 text-blue-700';

  if (statsLoading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Mouvements de stock</h2>
        <p className="text-stone-400 text-sm mt-1">Dernières opérations</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {['Type','Produit','Quantité','Motif','Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {mouvements.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-stone-400">Aucun mouvement</td></tr>
            ) : mouvements.map(m => (
              <tr key={m.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {icon(m.type)}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${badge(m.type)}`}>{m.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-stone-700">{m.stock?.chaussure?.nom ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${m.type === 'entree' ? 'text-green-600' : 'text-red-600'}`}>
                    {m.type === 'entree' ? '+' : '-'}{m.quantite}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">{m.motif ?? '—'}</td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {new Date(m.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}