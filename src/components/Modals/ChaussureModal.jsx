import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChaussure, updateChaussure } from '../../store/slices/chaussuresSlice';
import { closeModal, addNotification } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';

const EMPTY = {
  reference: '', nom: '', marque: '', categorie_id: '', fournisseur_id: '',
  prix_achat: '', prix_vente: '', couleur: '', matiere: '', description: '', image: null,
};

const cls = err => `w-full border ${err ? 'border-red-300' : 'border-stone-200'} rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white`;

function Field({ label, error, children, wide }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-stone-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
}

export default function ChaussureModal() {
  const dispatch     = useDispatch();
  const modal        = useSelector(s => s.ui.modal);
  const selected     = useSelector(s => s.chaussures.selected);
  const categories   = useSelector(s => s.categories.items);
  const fournisseurs = useSelector(s => s.fournisseurs.items);
  const isEdit = modal === 'editChaussure';

  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrors({});
    setForm(isEdit && selected ? { ...EMPTY, ...selected, image: null } : EMPTY);
  }, [isEdit, selected]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v); });
    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateChaussure({ id: selected.id, formData: fd })).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Chaussure modifiée !' }));
      } else {
        await dispatch(createChaussure(fd)).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Chaussure ajoutée !' }));
      }
      dispatch(closeModal());
    } catch (err) {
      setErrors(err?.errors || {});
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h3 className="font-bold text-lg text-stone-800">{isEdit ? 'Modifier' : 'Ajouter une chaussure'}</h3>
          <button onClick={() => dispatch(closeModal())} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500"><X size={18} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <Field label="Référence *" error={errors.reference}>
            <input value={form.reference} onChange={e => set('reference', e.target.value)} className={cls(errors.reference)} placeholder="NK-001" />
          </Field>
          <Field label="Nom *" error={errors.nom}>
            <input value={form.nom} onChange={e => set('nom', e.target.value)} className={cls(errors.nom)} placeholder="Air Max 90" />
          </Field>
          <Field label="Marque *" error={errors.marque}>
            <input value={form.marque} onChange={e => set('marque', e.target.value)} className={cls(errors.marque)} placeholder="Nike" />
          </Field>
          <Field label="Catégorie *" error={errors.categorie_id}>
            <select value={form.categorie_id} onChange={e => set('categorie_id', e.target.value)} className={cls(errors.categorie_id)}>
              <option value="">Sélectionner...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </Field>
          <Field label="Prix achat (MAD) *" error={errors.prix_achat}>
            <input type="number" min="0" value={form.prix_achat} onChange={e => set('prix_achat', e.target.value)} className={cls(errors.prix_achat)} />
          </Field>
          <Field label="Prix vente (MAD) *" error={errors.prix_vente}>
            <input type="number" min="0" value={form.prix_vente} onChange={e => set('prix_vente', e.target.value)} className={cls(errors.prix_vente)} />
          </Field>
          <Field label="Couleur">
            <input value={form.couleur} onChange={e => set('couleur', e.target.value)} className={cls()} placeholder="Blanc/Rouge" />
          </Field>
          <Field label="Matière">
            <input value={form.matiere} onChange={e => set('matiere', e.target.value)} className={cls()} placeholder="Cuir, Tissu..." />
          </Field>
          <Field label="Fournisseur" wide>
            <select value={form.fournisseur_id} onChange={e => set('fournisseur_id', e.target.value)} className={cls()}>
              <option value="">Aucun</option>
              {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </Field>
          <Field label="Description" wide>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={cls() + ' resize-none'} />
          </Field>
          <Field label="Image" wide>
            <input type="file" accept="image/*" onChange={e => set('image', e.target.files[0])}
              className="text-sm text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:text-xs file:font-medium" />
          </Field>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={() => dispatch(closeModal())} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
          <button onClick={submit} disabled={loading} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {loading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </div>
    </div>
  );
}
