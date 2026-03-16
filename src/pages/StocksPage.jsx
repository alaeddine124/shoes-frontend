import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, mouvementStock } from '../store/slices/stocksSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Archive, AlertTriangle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function StocksPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.stocks);
  const [alerteOnly, setAlerteOnly] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [mouvement, setMouvement]   = useState({ type: 'entree', quantite: 1, motif: '' });

  useEffect(() => {
    dispatch(fetchStocks(alerteOnly ? { alerte: 1 } : {}));
  }, [dispatch, alerteOnly]);

  const handleMouvement = async () => {
    if (!selected) return;
    try {
      await dispatch(mouvementStock({ id: selected.id, payload: mouvement })).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Mouvement enregistré !' }));
      setSelected(null);
      dispatch(fetchStocks(alerteOnly ? { alerte: 1 } : {}));
    } catch (err) {
      dispatch(addNotification({ type: 'error', message: err || 'Erreur' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Stock</h2>
          <p className="text-stone-400 text-sm mt-1">{items.length} entrées</p>
        </div>
        <button onClick={() => setAlerteOnly(a => !a)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            alerteOnly ? 'bg-red-500 text-white border-red-500' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}>
          <AlertTriangle size={15} /> {alerteOnly ? 'Toutes les entrées' : 'Alertes seulement'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {['Chaussure','Pointure','Genre','Quantité','Seuil','Statut','Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {items.map(s => (
                <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-800">{s.chaussure?.nom}</td>
                  <td className="px-4 py-3 text-stone-600">{s.pointure}</td>
                  <td className="px-4 py-3 text-stone-600 capitalize">{s.genre}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${s.quantite <= s.seuil_alerte ? 'text-red-500' : 'text-green-600'}`}>
                      {s.quantite}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-400">{s.seuil_alerte}</td>
                  <td className="px-4 py-3">
                    {s.quantite <= s.seuil_alerte
                      ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><AlertTriangle size={10} />Alerte</span>
                      : <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium w-fit block">OK</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(s)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100">
                      <Archive size={12} /> Mouvement
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-stone-400">Aucun stock trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-stone-800 mb-1">Mouvement de stock</h3>
            <p className="text-xs text-stone-400 mb-4">{selected.chaussure?.nom} — Pointure {selected.pointure}</p>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['entree','sortie','ajustement'].map(t => (
                  <button key={t} onClick={() => setMouvement(m => ({ ...m, type: t }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                      mouvement.type === t ? 'bg-amber-500 text-white border-amber-500' : 'border-stone-200 text-stone-600'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Quantité</label>
                <input type="number" min="1" value={mouvement.quantite}
                  onChange={e => setMouvement(m => ({ ...m, quantite: +e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Motif</label>
                <input value={mouvement.motif}
                  onChange={e => setMouvement(m => ({ ...m, motif: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                  placeholder="Vente, retour, inventaire..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600">Annuler</button>
              <button onClick={handleMouvement} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}