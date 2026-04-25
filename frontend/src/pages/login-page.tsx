import { useEffect, useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiPostJson } from '@/lib/api-client';
import { validateEmail, validatePassword } from '@/lib/form-validation';
import type { LoginResponseBody } from '@/types/auth-api';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const brandTeal = '#00686A';
const fieldBorder = '#E2DDD3';
const mutedLine = '#596475';

const fieldShellClass =
  'rounded-[10px] border px-4 py-2 shadow-none focus-within:ring-2 focus-within:ring-[#00686A]/25';

const inputClassName = cn(
  'h-auto min-h-0 border-0 bg-transparent p-0 text-base font-medium tracking-[0.06em] text-black shadow-none focus-visible:ring-0',
  'placeholder:font-medium placeholder:tracking-[0.06em] placeholder:text-[rgba(89,100,135,0.73)]',
);

export function LoginPage() {
  const emailFieldId: string = useId();
  const passwordFieldId: string = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const state = location.state as { email?: string } | null;
    if (state?.email) {
      setEmail(state.email);
    }
  }, [location.state]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setIsSubmitting(true);
    const result = await apiPostJson<LoginResponseBody>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({
      role: result.data.role,
      id: result.data.id,
      email: result.data.email,
      displayName: result.data.displayName,
    });
    navigate('/', { replace: true });
  };
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-[13px] p-2">
        <LogIn className="size-[30px] shrink-0 text-black" strokeWidth={2} aria-hidden />
        <h1 className="text-[28px] leading-tight font-bold tracking-[0.04em] text-black">
          Entrar
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[385px] flex-col gap-8"
      >
        {error ? (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
          >
            {error}
          </div>
        ) : null}
        <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 self-stretch">
          <Label
            htmlFor={emailFieldId}
            className="text-base font-bold tracking-[0.06em] text-black"
          >
            E-mail
          </Label>
          <div className={fieldShellClass} style={{ borderColor: fieldBorder }}>
            <Input
              id={emailFieldId}
              name="email"
              type="email"
              autoComplete="email"
              className={inputClassName}
              placeholder="empresa@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              aria-invalid={Boolean(error)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 self-stretch">
          <Label
            htmlFor={passwordFieldId}
            className="text-base font-bold tracking-[0.06em] text-black"
          >
            Senha
          </Label>
          <div className={fieldShellClass} style={{ borderColor: fieldBorder }}>
            <Input
              id={passwordFieldId}
              name="password"
              type="password"
              autoComplete="current-password"
              className={inputClassName}
              placeholder="Digite sua senha"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              aria-invalid={Boolean(error)}
              required
            />
          </div>
        </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[60px] w-full max-w-[384px] items-center justify-center rounded-[15px] text-xl font-bold tracking-[0.06em] text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: brandTeal }}
        >
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="w-full text-center text-base font-bold tracking-[0.06em]">
        <span style={{ color: mutedLine }}>Não tem conta? </span>
        <Link to="/" className="underline" style={{ color: brandTeal }}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
