import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChaussures, deleteChaussure, setSelected, setFilters } from '../store/slices/chaussuresSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { openModal } from '../store/slices/uiSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

export default function ChaussuresPage() {
  const dispatch     = useDispatch();
  const { items, loading, filters } = useSelector(s => s.chaussures);
  const categories   = useSelector(s => s.categories.items);

  useEffect(() => {
    dispatch(fetchChaussures(filters));
    dispatch(fetchCategories());
  }, [dispatch]);

  const search = () => dispatch(fetchChaussures(filters));

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette chaussure ?')) return;
    await dispatch(deleteChaussure(id));
    dispatch(addNotification({ type: 'success', message: 'Chaussure supprimée' }));
  };

  const handleEdit = (c) => {
    dispatch(setSelected(c));
    dispatch(openModal('editChaussure'));
  };

  const handleAddStock = (c) => {
    dispatch(setSelected(c));
    dispatch(openModal('addStock'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Chaussures</h2>
          <p className="text-stone-400 text-sm mt-1">{items.length} produits</p>
        </div>
        <button onClick={() => dispatch(openModal('addChaussure'))}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={filters.search}
              onChange={e => dispatch(setFilters({ search: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl outline-none focus:border-amber-400"
            />
          </div>
          <select value={filters.categorie_id}
            onChange={e => dispatch(setFilters({ categorie_id: e.target.value }))}
            className="border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400">
            <option value="">Toutes catégories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          <button onClick={search}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl text-sm font-medium hover:bg-stone-700">
            Filtrer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                {c.image
                  ? <img src={`/storage/${c.image}`} alt={c.nom} className="h-full w-full object-cover" />
                  : <Package size={40} className="text-stone-300" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-stone-800 text-sm leading-tight">{c.nom}</h3>
                  {c.en_alerte && <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />}
                </div>
                <p className="text-xs text-stone-400 mb-2">{c.marque} · {c.reference}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">{c.categorie?.nom}</span>
                  <span className="text-sm font-bold text-stone-800">{c.prix_vente} MAD</span>
                </div>
                <p className="text-xs text-stone-400 mb-3">Stock: <span className={`font-bold ${c.en_alerte ? 'text-red-500' : 'text-green-600'}`}>{c.total_stock}</span></p>
                <div className="flex gap-2">
                  <button onClick={() => handleAddStock(c)} className="flex-1 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100">
                    + Stock
                  </button>
                  <button onClick={() => handleEdit(c)} className="p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-16 text-stone-400">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p>Aucune chaussure trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}