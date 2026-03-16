import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStock } from '../../store/slices/stocksSlice';
import { closeModal, addNotification } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';

const POINTURES = ['35','36','37','38','39','40','41','42','43','44','45','46'];
const GENRES    = ['homme','femme','enfant','mixte'];

export default function StockModal() {
  const dispatch = useDispatch();
  const selected = useSelector(s => s.chaussures.selected);
  const [form, setForm]     = useState({ pointure: '40', genre: 'mixte', quantite: 0, seuil_alerte: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true); setError(null);
    try {
      await dispatch(createStock({ ...form, chaussure_id: selected.id })).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Stock ajouté avec succès' }));
      dispatch(closeModal());
    } catch (err) { setError(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-800">Ajouter un stock</h3>
            <p className="text-xs text-stone-400 mt-0.5">{selected?.nom} — {selected?.marque}</p>
          </div>
          <button onClick={() => dispatch(closeModal())} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Pointure *</label>
            <select value={form.pointure} onChange={e => set('pointure', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              {POINTURES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Genre *</label>
            <div className="grid grid-cols-4 gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => set('genre', g)} type="button"
                  className={`py-2 rounded-lg text-xs font-medium capitalize border transition-colors ${
                    form.genre === g ? 'bg-amber-500 text-white border-amber-500' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Quantité</label>
              <input type="number" min="0" value={form.quantite} onChange={e => set('quantite', +e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Seuil alerte</label>
              <input type="number" min="0" value={form.seuil_alerte} onChange={e => set('seuil_alerte', +e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={() => dispatch(closeModal())} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600">Annuler</button>
          <button onClick={submit} disabled={loading} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {loading ? 'Enregistrement...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}