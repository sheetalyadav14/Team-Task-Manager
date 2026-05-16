import Badge from './Badge.jsx';

const PRIORITIES = {
  low: { label: 'Low', tone: 'default' },
  medium: { label: 'Medium', tone: 'violet' },
  high: { label: 'High', tone: 'red' },
};

export default function PriorityBadge({ priority }) {
  const meta = PRIORITIES[priority] || PRIORITIES.medium;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
