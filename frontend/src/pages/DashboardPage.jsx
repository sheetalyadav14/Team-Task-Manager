import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ListTodo,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Card from '../components/Card.jsx';
import TaskStatusBadge from '../components/TaskStatusBadge.jsx';
import Badge from '../components/Badge.jsx';
import { fetchMyTasks, fetchTaskStats } from '../store/tasksSlice.js';
import { formatDate, isOverdue } from '../utils/dates.js';

const STAT_CARDS = [
  { key: 'total', label: 'Total tasks', icon: ListTodo, tint: 'bg-slate-50 text-slate-600' },
  {
    key: 'in_progress',
    label: 'In progress',
    icon: Loader2,
    tint: 'bg-brand-50 text-brand-600',
  },
  {
    key: 'done',
    label: 'Completed',
    icon: CheckCircle2,
    tint: 'bg-emerald-50 text-emerald-600',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    tint: 'bg-red-50 text-red-600',
  },
];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const stats = useSelector((s) => s.tasks.stats);
  const mine = useSelector((s) => s.tasks.mine);

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchMyTasks());
  }, [dispatch]);

  const recent = mine.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Hi {user?.name?.split(' ')[0] || 'there'},
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's an overview of your tasks across all projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, tint }) => (
          <Card key={key} interactive className="flex items-center gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
              <Icon size={22} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats ? stats[key] : '—'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Recent tasks</h2>
            <p className="text-sm text-slate-500">Your latest activity across projects.</p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View projects
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {recent.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">
              No tasks yet. Create a project to get started.
            </p>
          )}
          {recent.map((task) => {
            const overdue = isOverdue(task);
            return (
              <Link
                key={task.id}
                to={`/projects/${task.project_id}`}
                className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {task.title}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-slate-500">Due {formatDate(task.due_date)}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {overdue && <Badge tone="red">Overdue</Badge>}
                  <TaskStatusBadge status={task.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
