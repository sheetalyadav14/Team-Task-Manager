import Badge from './Badge.jsx';

const LABELS = {
  todo: { label: 'To do', tone: 'default' },
  in_progress: { label: 'In progress', tone: 'brand' },
  done: { label: 'Done', tone: 'green' },
};

export default function TaskStatusBadge({ status }) {
  const meta = LABELS[status] || LABELS.todo;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
