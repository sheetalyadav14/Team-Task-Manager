import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuestRoute({ children }) {
  const { status } = useSelector((s) => s.auth);
  if (status === 'restoring') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
