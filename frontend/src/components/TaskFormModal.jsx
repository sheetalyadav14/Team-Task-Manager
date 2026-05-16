import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import Modal from './Modal.jsx';
import Field from './Field.jsx';
import Input from './Input.jsx';
import Textarea from './Textarea.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';
import { createTask, updateTask } from '../store/tasksSlice.js';
import { toDateInputValue } from '../utils/dates.js';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(4000).optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assignee_id: z.string().optional().default(''),
  due_date: z.string().optional().default(''),
});

export default function TaskFormModal({ open, onClose, project, task }) {
  const dispatch = useDispatch();
  const editing = Boolean(task);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee_id: '',
      due_date: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'todo',
        priority: task?.priority || 'medium',
        assignee_id: task?.assignee_id || '',
        due_date: toDateInputValue(task?.due_date) || '',
      });
    }
  }, [open, task, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      description: values.description || '',
      status: values.status,
      priority: values.priority,
      assignee_id: values.assignee_id || null,
      due_date: values.due_date || null,
    };
    const action = editing
      ? updateTask({ taskId: task.id, payload })
      : createTask({ projectId: project.id, payload });
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      onClose?.();
    } else {
      setError('root', { message: result.payload || 'Save failed' });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit task' : 'New task'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editing ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Title" htmlFor="task-title" error={errors.title?.message}>
          <Input id="task-title" {...register('title')} error={!!errors.title} />
        </Field>
        <Field
          label="Description"
          htmlFor="task-description"
          error={errors.description?.message}
        >
          <Textarea
            id="task-description"
            rows={3}
            {...register('description')}
            error={!!errors.description}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="task-status" error={errors.status?.message}>
            <Select id="task-status" {...register('status')}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </Select>
          </Field>
          <Field label="Priority" htmlFor="task-priority" error={errors.priority?.message}>
            <Select id="task-priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </Field>
          <Field
            label="Assignee"
            htmlFor="task-assignee"
            error={errors.assignee_id?.message}
          >
            <Select id="task-assignee" {...register('assignee_id')}>
              <option value="">Unassigned</option>
              {project?.members?.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.name || m.email || m.user_id}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Due date" htmlFor="task-due" error={errors.due_date?.message}>
            <Input id="task-due" type="date" {...register('due_date')} />
          </Field>
        </div>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      </form>
    </Modal>
  );
}
