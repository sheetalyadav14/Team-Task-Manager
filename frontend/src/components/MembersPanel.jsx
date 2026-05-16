import { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import { fetchUsers } from '../store/usersSlice.js';
import { addMember, removeMember } from '../store/projectsSlice.js';

export default function MembersPanel({ project, canManage }) {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.list);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (canManage && users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [canManage, dispatch, users.length]);

  const memberIds = new Set(project.members.map((m) => m.user_id));
  const candidates = users.filter((u) => !memberIds.has(u.id));

  const handleAdd = async () => {
    setError(null);
    if (!userId) return;
    const result = await dispatch(addMember({ projectId: project.id, userId, role }));
    if (result.meta.requestStatus === 'fulfilled') {
      setUserId('');
      setRole('member');
    } else {
      setError(result.payload || 'Failed to add member');
    }
  };

  const handleRemove = async (memberUserId) => {
    setError(null);
    const result = await dispatch(removeMember({ projectId: project.id, userId: memberUserId }));
    if (result.meta.requestStatus !== 'fulfilled') {
      setError(result.payload || 'Failed to remove member');
    }
  };

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-800">Team</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
      </p>
      <ul className="mt-4 space-y-2">
        {project.members.map((m) => (
          <li
            key={m.user_id}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {m.name || m.user_id}
              </p>
              <p className="truncate text-xs text-slate-500">{m.email || ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={m.role === 'admin' ? 'brand' : 'default'}>{m.role}</Badge>
              {canManage && m.user_id !== project.owner_id && (
                <button
                  type="button"
                  onClick={() => handleRemove(m.user_id)}
                  className="rounded p-1 text-slate-500 hover:bg-white hover:text-red-600"
                  aria-label={`Remove ${m.name || 'member'}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {canManage && (
        <div className="mt-4 space-y-2 rounded-lg border border-dashed border-slate-200 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Add member
          </p>
          <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a user...</option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </Select>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>
          <Button onClick={handleAdd} disabled={!userId} className="w-full">
            <UserPlus size={14} />
            Add to project
          </Button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    </Card>
  );
}
