import { useState } from 'react';
import { Pencil, Trash2, CalendarDays, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import TaskStatusBadge from './TaskStatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import Badge from './Badge.jsx';
import TaskFormModal from './TaskFormModal.jsx';
import { removeTask } from '../store/tasksSlice.js';
import { formatDate, isOverdue } from '../utils/dates.js';

export default function TaskRow({ task, project, canManage }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const overdue = isOverdue(task);
  const assignee = project?.members?.find((m) => m.user_id === task.assignee_id);

  const handleDelete = () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    dispatch(removeTask({ taskId: task.id, projectId: task.project_id }));
  };

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
            <TaskStatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {overdue && <Badge tone="red">Overdue</Badge>}
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {task.due_date && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={12} />
                {formatDate(task.due_date)}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {assignee ? assignee.name || assignee.email : 'Unassigned'}
            </span>
          </div>
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-slate-200 bg-white p-2 text-red-600 hover:bg-red-50"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      <TaskFormModal
        open={editing}
        onClose={() => setEditing(false)}
        project={project}
        task={task}
      />
    </>
  );
}
