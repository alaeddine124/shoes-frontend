import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFournisseurs, createFournisseur, deleteFournisseur } from '../store/slices/fournisseursSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Plus, Trash2, Truck } from 'lucide-react';

export default function FournisseursPage() {
  const dispatch  = useDispatch();
  const { items } = useSelector(s => s.fournisseurs);
  const [form, setForm]   = useState({ nom: '', email: '', telephone: '', adresse: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow]   = useState(false);

  useEffect(() => { dispatch(fetchFournisseurs()); }, [dispatch]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.nom.trim()) return;
    setLoading(true);
    try {
      await dispatch(createFournisseur(form)).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Fournisseur ajouté !' }));
      setForm({ nom: '', email: '', telephone: '', adresse: '' });
      setShow(false);
    } catch (_) {
      dispatch(addNotification({ type: 'error', message: 'Erreur lors de l\'ajout' }));
    } finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce fournisseur ?')) return;
    await dispatch(deleteFournisseur(id));
    dispatch(addNotification({ type: 'success', message: 'Fournisseur supprimé' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Fournisseurs</h2>
          <p className="text-stone-400 text-sm mt-1">{items.length} fournisseurs</p>
        </div>
        <button onClick={() => setShow(s => !s)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {show && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-semibold text-stone-700 mb-4">Nouveau fournisseur</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.nom}       onChange={e => set('nom', e.target.value)}       placeholder="Nom *"       className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            <input value={form.email}     onChange={e => set('email', e.target.value)}     placeholder="Email"       className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            <input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="Téléphone"   className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            <input value={form.adresse}   onChange={e => set('adresse', e.target.value)}   placeholder="Adresse"     className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShow(false)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600">Annuler</button>
            <button onClick={submit} disabled={loading || !form.nom.trim()}
              className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Truck size={18} className="text-blue-600" />
              </div>
              <button onClick={() => handleDelete(f.id)} className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={15} />
              </button>
            </div>
            <p className="font-semibold text-stone-800">{f.nom}</p>
            {f.email     && <p className="text-xs text-stone-400 mt-1">{f.email}</p>}
            {f.telephone && <p className="text-xs text-stone-400">{f.telephone}</p>}
            {f.adresse   && <p className="text-xs text-stone-400">{f.adresse}</p>}
            <p className="text-xs text-stone-300 mt-2">{f.chaussures_count ?? 0} produits</p>
          </div>
        ))}
      </div>
    </div>
  );
}