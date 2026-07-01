import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const PREFERENCES = [
  { id: 'electronics', label: 'Electronics', icon: '⚡' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'automotive', label: 'Automotive', icon: '🚗' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'books', label: 'Books', icon: '📚' },
] as const;

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    preferences: z.array(z.string()).min(1, 'Select at least one preference'),
    agreeToTerms: z.boolean().refine((val) => val, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      preferences: [],
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          preferences: data.preferences,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Account created! Check your email to confirm your account.');
    navigate({ to: '/login' });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-[#060d1a] p-10 lg:flex">
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-indigo-700/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">FlipIt</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-white">
              Start trading<br />in minutes.
            </h1>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-slate-400">
              Join 240,000+ buyers and sellers trading verified secondhand goods — with bidding and instant buy, all in one trusted place.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              'Verified-seller protection on every order',
              'Bid live or buy instantly',
              'List your first item free',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Rating badge */}
          <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div className="flex -space-x-2.5">
              {['bg-blue-400', 'bg-purple-400', 'bg-cyan-400'].map((color, i) => (
                <div
                  key={i}
                  className={cn('h-8 w-8 rounded-full border-2 border-[#060d1a]', color)}
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Rated 4.9 / 5 by sellers</p>
              <p className="text-xs text-slate-400">"Sold my camera in 6 hours flat."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto bg-white px-6 py-10 lg:px-14">
        <div className="w-full max-w-[420px] space-y-5">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline transition-colors hover:text-gray-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to marketplace
          </Link>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-[1.7rem] font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="text-sm text-gray-500">
              Join the marketplace for premium secondhand goods.
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <AppleIcon />
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name */}
            <FormField label="Full name" error={errors.fullName?.message}>
              <input
                {...register('fullName')}
                placeholder="Jordan Rivera"
                className={inputClass(!!errors.fullName)}
              />
            </FormField>

            {/* Email */}
            <FormField label="Email" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                placeholder="you@email.com"
                className={inputClass(!!errors.email)}
              />
            </FormField>

            {/* Password */}
            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(inputClass(!!errors.password), 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            {/* Confirm password */}
            <FormField label="Confirm password" error={errors.confirmPassword?.message}>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(inputClass(!!errors.confirmPassword), 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormField>

            {/* Preferences */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Preferences</label>
                <p className="text-xs text-gray-400">Select categories you're interested in</p>
              </div>
              <Controller
                name="preferences"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {PREFERENCES.map(({ id, label, icon }) => {
                      const selected = field.value.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            const next = selected
                              ? field.value.filter((p) => p !== id)
                              : [...field.value, id];
                            field.onChange(next);
                          }}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                            selected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600',
                          )}
                        >
                          <span className="text-base leading-none">{icon}</span>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.preferences && (
                <p className="text-xs text-red-500">{errors.preferences.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <span className="font-medium text-indigo-600 hover:underline cursor-pointer">
                        Terms
                      </span>
                    </span>
                  </label>
                )}
              />
              {errors.agreeToTerms && (
                <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="pb-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 no-underline hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all',
    'placeholder:text-gray-400',
    'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
    hasError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-200',
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}
