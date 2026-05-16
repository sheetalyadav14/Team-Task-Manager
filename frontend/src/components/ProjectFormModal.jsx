import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import Modal from './Modal.jsx';
import Field from './Field.jsx';
import Input from './Input.jsx';
import Textarea from './Textarea.jsx';
import Button from './Button.jsx';
import { createProject, updateProject } from '../store/projectsSlice.js';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  description: z.string().max(2000).optional().default(''),
});

export default function ProjectFormModal({ open, onClose, project }) {
  const dispatch = useDispatch();
  const editing = Boolean(project);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: project?.name || '',
        description: project?.description || '',
      });
    }
  }, [open, project, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const action = editing
      ? updateProject({ id: project.id, ...values })
      : createProject(values);
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
      title={editing ? 'Edit project' : 'New project'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editing ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name" htmlFor="project-name" error={errors.name?.message}>
          <Input id="project-name" {...register('name')} error={!!errors.name} />
        </Field>
        <Field
          label="Description"
          htmlFor="project-description"
          error={errors.description?.message}
        >
          <Textarea
            id="project-description"
            rows={4}
            {...register('description')}
            error={!!errors.description}
          />
        </Field>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      </form>
    </Modal>
  );
}
