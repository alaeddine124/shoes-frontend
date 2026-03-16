import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategorie, deleteCategorie } from '../store/slices/categoriesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function CategoriesPage() {
  const dispatch    = useDispatch();
  const { items }   = useSelector(s => s.categories);
  const [form, setForm] = useState({ nom: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const submit = async () => {
    if (!form.nom.trim()) return;
    setLoading(true);
    try {
      await dispatch(createCategorie(form)).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Catégorie ajoutée !' }));
      setForm({ nom: '', description: '' });
    } catch (_) {
      dispatch(addNotification({ type: 'error', message: 'Nom déjà existant' }));
    } finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await dispatch(deleteCategorie(id)).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Catégorie supprimée' }));
    } catch (_) {
      dispatch(addNotification({ type: 'error', message: 'Impossible de supprimer' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Catégories</h2>
        <p className="text-stone-400 text-sm mt-1">{items.length} catégories</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h3 className="font-semibold text-stone-700 mb-4">Nouvelle catégorie</h3>
        <div className="flex gap-3 flex-wrap">
          <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            placeholder="Nom *" className="flex-1 min-w-40 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description" className="flex-1 min-w-40 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
          <button onClick={submit} disabled={loading || !form.nom.trim()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tag size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 truncate">{c.nom}</p>
              <p className="text-xs text-stone-400">{c.chaussures_count ?? 0} produits</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}