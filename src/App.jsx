import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSelector as useSel } from 'react-redux';
import Layout         from './components/Layout/Layout';
import Notifications  from './components/UI/Notifications';
import ChaussureModal from './components/Modals/ChaussureModal';
import StockModal     from './components/Modals/StockModal';
import LoginPage      from './pages/LoginPage';
import Dashboard      from './pages/Dashboard';
import ChaussuresPage from './pages/ChaussuresPage';
import StocksPage     from './pages/StocksPage';
import CategoriesPage from './pages/CategoriesPage';
import FournisseursPage from './pages/FournisseursPage';
import MouvementsPage from './pages/MouvementsPage';

function PrivateRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

function Modals() {
  const modal = useSel(s => s.ui.modal);
  if (modal === 'addChaussure' || modal === 'editChaussure') return <ChaussureModal />;
  if (modal === 'addStock') return <StockModal />;
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Notifications />
      <Modals />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="chaussures"   element={<ChaussuresPage />} />
          <Route path="stocks"       element={<StocksPage />} />
          <Route path="mouvements"   element={<MouvementsPage />} />
          <Route path="categories"   element={<CategoriesPage />} />
          <Route path="fournisseurs" element={<FournisseursPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
