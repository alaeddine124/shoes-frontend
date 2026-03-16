import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const submit = e => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">ShoesStock</h1>
          <p className="text-stone-400 text-sm mt-1">Gestion de stock chaussures</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="admin@shoes.ma"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 pr-10"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-6">
          admin@shoes.ma / password
        </p>
      </div>
    </div>
  );
}