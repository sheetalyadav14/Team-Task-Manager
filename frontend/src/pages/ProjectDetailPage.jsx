import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Select from '../components/Select.jsx';
import Card from '../components/Card.jsx';
import TaskRow from '../components/TaskRow.jsx';
import TaskFormModal from '../components/TaskFormModal.jsx';
import ProjectFormModal from '../components/ProjectFormModal.jsx';
import MembersPanel from '../components/MembersPanel.jsx';
import { fetchProject, removeProject } from '../store/projectsSlice.js';
import { fetchTasksForProject } from '../store/tasksSlice.js';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const project = useSelector((s) => s.projects.current);
  const tasksByProject = useSelector((s) => s.tasks.byProject);
  const tasks = useMemo(
    () => tasksByProject[projectId] || [],
    [tasksByProject, projectId],
  );

  const [statusFilter, setStatusFilter] = useState('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
      dispatch(fetchTasksForProject({ projectId, filters: {} }));
    }
  }, [dispatch, projectId]);

  if (!project || project.id !== projectId) {
    return <p className="text-sm text-slate-500">Loading project...</p>;
  }

  const currentMember = project.members.find((m) => m.user_id === user?.id);
  const isAdmin = currentMember?.role === 'admin';

  const filteredTasks =
    statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);

  const handleDelete = async () => {
    if (!window.confirm(`Delete project "${project.name}"? This removes all tasks.`)) {
      return;
    }
    const result = await dispatch(removeProject(project.id));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/projects', { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={14} />
        Back to projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {project.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {project.description || 'No description provided.'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setProjectModalOpen(true)}>
              <Pencil size={14} />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Tasks</h2>
                <p className="text-xs text-slate-500">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-auto"
                >
                  <option value="all">All statuses</option>
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </Select>
                <Button onClick={() => setTaskModalOpen(true)}>
                  <Plus size={14} />
                  New task
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {filteredTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                  No tasks match this view.
                </p>
              )}
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  project={project}
                  canManage
                />
              ))}
            </div>
          </Card>
        </section>
        <aside>
          <MembersPanel project={project} canManage={isAdmin} />
        </aside>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        project={project}
      />
      <ProjectFormModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={project}
      />
    </div>
  );
}
