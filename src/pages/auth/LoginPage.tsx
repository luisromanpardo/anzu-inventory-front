import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore, useUIStore } from '../../stores';
import { Button, Input } from '../../components/ui';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, clearError } = useAuthStore();
  const { addToast } = useUIStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    clearError();
    try {
      await login(data.email, data.password);
      addToast({ message: 'Welcome back!', type: 'success' });
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-canvas rounded-[28px] p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-body-lg font-semibold text-ink-black mb-2">Welcome Back</h1>
          <p className="text-body-sm text-muted-text">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-4 rounded-[11.4046px] bg-red-50 border border-red-500 text-red-800 text-body-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-body-sm text-muted-text">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
              className={errors.email ? 'ring-2 ring-red-500' : ''}
            />
            {errors.email && (
              <p className="text-caption text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-body-sm text-muted-text">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              error={errors.password?.message}
            />
            {errors.password && (
              <p className="text-caption text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-shop-violet text-white hover:bg-shop-violet/90"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body-sm text-muted-text">
            Don't have an account?{' '}
            <Link to="/register" className="text-shop-violet hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}