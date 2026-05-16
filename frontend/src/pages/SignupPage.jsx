import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckSquare } from 'lucide-react';
import Field from '../components/Field.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import { signup } from '../store/authSlice.js';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'member']),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', role: 'member' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await dispatch(signup(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard', { replace: true });
    } else {
      setError('root', { message: result.payload || 'Signup failed' });
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <CheckSquare size={22} />
          </span>
          <h1 className="text-2xl font-semibold text-slate-800">Create your account</h1>
          <p className="text-sm text-slate-500">Start organizing your team's work in seconds.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                autoComplete="name"
                {...register('name')}
                error={!!errors.name}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
              />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                {...register('password')}
                error={!!errors.password}
              />
            </Field>
            <Field label="Account role" htmlFor="role" error={errors.role?.message}>
              <Select id="role" {...register('role')}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>
            {errors.root && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.root.message}
              </div>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
