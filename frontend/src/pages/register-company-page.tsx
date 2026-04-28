import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, CheckSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiPostJson } from '@/lib/api-client';
import {
  validateCompanyName,
  validateEmail,
  validatePassword,
} from '@/lib/form-validation';
import { cn } from '@/lib/utils';

type CompanyCreated = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

const brandOrange = '#EF852E';
const fieldBorder = '#E2DDD3';
const mutedLine = '#596475';
const brandTealLink = '#00686A';

const fieldShellClass =
  'rounded-[10px] border px-4 py-2 shadow-none focus-within:ring-2 focus-within:ring-[#EF852E]/25';

const inputClassName = cn(
  'h-auto min-h-0 border-0 bg-transparent p-0 text-base font-medium tracking-[0.06em] text-black shadow-none focus-visible:ring-0',
  'placeholder:font-medium placeholder:tracking-[0.06em] placeholder:text-[rgba(89,100,135,0.73)]',
);

export function RegisterCompanyPage() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const termsId = useId();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!acceptedTerms) {
      setError('Aceite os termos para continuar.');
      return;
    }
    const nameError = validateCompanyName(name);
    if (nameError) {
      setError(nameError);
      return;
    }
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
    const result = await apiPostJson<CompanyCreated>('/companies', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/entrar', {
      replace: true,
      state: { email: result.data.email },
    });
  };
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-[13px] p-2">
        <Building2
          className="size-[22px] shrink-0"
          style={{ color: brandOrange }}
          strokeWidth={2}
          aria-hidden
        />
        <h1 className="text-[28px] leading-tight font-bold tracking-[0.04em] text-black">
          Cadastro Empresa
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
            htmlFor={nameId}
            className="text-base font-bold tracking-[0.06em] text-black"
          >
            Nome da empresa
          </Label>
          <div className={fieldShellClass} style={{ borderColor: fieldBorder }}>
            <Input
              id={nameId}
              name="name"
              autoComplete="organization"
              className={inputClassName}
              placeholder="Nome da empresa"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 self-stretch">
          <Label
            htmlFor={emailId}
            className="text-base font-bold tracking-[0.06em] text-black"
          >
            E-mail
          </Label>
          <div className={fieldShellClass} style={{ borderColor: fieldBorder }}>
            <Input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              className={inputClassName}
              placeholder="empresa@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 self-stretch">
          <Label
            htmlFor={passwordId}
            className="text-base font-bold tracking-[0.06em] text-black"
          >
            Senha
          </Label>
          <div className={fieldShellClass} style={{ borderColor: fieldBorder }}>
            <Input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="new-password"
              className={inputClassName}
              placeholder="Crie uma senha"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>
        </div>
        </div>
        <div className="relative min-h-[38px] w-full max-w-[386px]">
          <input
            id={termsId}
            type="checkbox"
            checked={acceptedTerms}
            onChange={(ev) => setAcceptedTerms(ev.target.checked)}
            className="absolute top-0.5 left-0 size-[15px] cursor-pointer rounded-[3px] border"
            style={{ borderColor: '#E2DDD4', accentColor: brandOrange }}
          />
          <label
            htmlFor={termsId}
            className="block cursor-pointer pl-[26px] text-base font-medium tracking-[0.06em] text-black"
          >
            Li e aceito os{' '}
            <Link to="#" className="font-medium" style={{ color: brandTealLink }}>
              termos de uso
            </Link>{' '}
            e a{' '}
            <Link to="#" className="font-medium" style={{ color: brandTealLink }}>
              política de privacidade
            </Link>
            .
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[60px] w-full max-w-[384px] items-center justify-center gap-2 rounded-[15px] text-base font-bold tracking-[0.06em] text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: brandOrange }}
        >
          <CheckSquare className="size-6 shrink-0 text-white" aria-hidden />
          {isSubmitting ? 'Criando conta…' : 'Criar conta da empresa'}
        </button>
      </form>
      <p className="w-full text-center text-base font-bold tracking-[0.06em]">
        <span style={{ color: mutedLine }}>Já tem conta? </span>
        <Link to="/entrar" className="underline" style={{ color: brandTealLink }}>
          Faça login
        </Link>
      </p>
    </div>
  );
}
