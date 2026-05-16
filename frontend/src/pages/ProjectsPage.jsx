import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Users } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProjectFormModal from '../components/ProjectFormModal.jsx';
import { fetchProjects } from '../store/projectsSlice.js';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { list: projects, loading, error } = useSelector((s) => s.projects);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            All projects you have access to.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          New project
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && projects.length === 0 && (
        <p className="text-sm text-slate-500">Loading projects...</p>
      )}

      {!loading && projects.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FolderKanban size={22} />
          </span>
          <h3 className="mt-3 text-base font-semibold text-slate-800">No projects yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Create your first project to start organizing tasks with your team.
          </p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <Plus size={16} />
            New project
          </Button>
        </Card>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-800 group-hover:text-brand-700">
                  {project.name}
                </h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FolderKanban size={16} />
                </span>
              </div>
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-slate-600">
                {project.description || 'No description provided.'}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                <Users size={12} />
                <span>
                  {project.members.length}{' '}
                  {project.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ProjectFormModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
