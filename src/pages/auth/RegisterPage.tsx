import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore, useUIStore } from '../../stores';
import { Button, Input } from '../../components/ui';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, clearError } = useAuthStore();
  const { addToast } = useUIStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    clearError();
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        terms_accepted: data.terms_accepted,
      });
      addToast({ message: 'Account created successfully!', type: 'success' });
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-canvas rounded-[28px] p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-body-lg font-semibold text-ink-black mb-2">Create Account</h1>
          <p className="text-body-sm text-muted-text">Join Anzu Inventory today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="p-4 rounded-[11.4046px] bg-red-50 border border-red-500 text-red-800 text-body-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-body-sm text-muted-text">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register('username')}
              error={errors.username?.message}
            />
            {errors.username && (
              <p className="text-caption text-red-600">{errors.username.message}</p>
            )}
          </div>

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
              placeholder="Create a password (min 8 characters)"
              {...register('password')}
              error={errors.password?.message}
            />
            {errors.password && (
              <p className="text-caption text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-body-sm text-muted-text">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            {errors.confirmPassword && (
              <p className="text-caption text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              {...register('terms_accepted')}
              className="mt-1 h-4 w-4 rounded border-subtle-gray text-shop-violet focus:ring-shop-violet"
            />
            <label htmlFor="terms" className="text-body-sm text-muted-text">
              I agree to the{' '}
              <a href="#" className="text-shop-violet hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-shop-violet hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms_accepted && (
            <p className="text-caption text-red-600">{errors.terms_accepted.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-shop-violet text-white hover:bg-shop-violet/90"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body-sm text-muted-text">
            Already have an account?{' '}
            <Link to="/login" className="text-shop-violet hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}