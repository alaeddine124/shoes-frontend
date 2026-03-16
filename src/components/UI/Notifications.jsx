import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Notifications() {
  const dispatch      = useDispatch();
  const notifications = useSelector(s => s.ui.notifications);

  useEffect(() => {
    notifications.forEach(n => {
      const t = setTimeout(() => dispatch(removeNotification(n.id)), 4000);
      return () => clearTimeout(t);
    });
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto min-w-72 ${
          n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {n.type === 'success'
            ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            : <XCircle     size={16} className="text-red-500 flex-shrink-0" />}
          <p className="text-sm flex-1">{n.message}</p>
          <button onClick={() => dispatch(removeNotification(n.id))} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}