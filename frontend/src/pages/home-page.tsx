import { Link } from 'react-router-dom';
import {
  ArrowDownCircle,
  Briefcase,
  Building2,
  UserRound,
} from 'lucide-react';

import heroImageSrc from '@/assets/Hero.jpg';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const brandTeal = '#00686A';
const brandOrange = '#EF852E';
const sectionCream = '#FCFAF4';
const iconBgPro = '#E6F0F0';
const iconBgCompany = '#FDEDE0';

export function HomePage() {
  const session = useAuthStore((s) => s.session);
  const pageGutter = 'px-4 sm:px-8 lg:px-[min(220px,12vw)]';
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className={cn('relative pt-10 pb-16 lg:pt-14 lg:pb-20', pageGutter)}>
          <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-center lg:gap-8 xl:gap-11">
            <div className="max-w-[538px] shrink-0 space-y-9">
              <div className="space-y-[19px]">
                <h1 className="text-[clamp(2rem,5vw,3.125rem)] leading-[1.08] font-bold tracking-[-0.01em] text-black">
                  Oportunidades para talentos 50+
                </h1>
                <p className="max-w-[473px] text-xl leading-snug font-bold tracking-[-0.01em] text-black">
                  Encontre vagas e conexões que valorizam sua experiência. Simples,
                  acessível e feito para você.
                </p>
              </div>
              {session ? (
                <div className="border-border bg-card space-y-4 rounded-[13px] border p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  <p className="text-foreground text-base">
                    Olá,{' '}
                    <span className="font-bold">{session.displayName}</span>. Conta{' '}
                    <span className="font-semibold">
                      {session.role === 'company' ? 'empresa' : 'profissional'}
                    </span>
                    .
                  </p>
                  <Link
                    to="/entrar"
                    className="inline-flex h-12 items-center justify-center rounded-2xl px-6 text-lg font-bold text-white transition-opacity hover:opacity-95"
                    style={{ backgroundColor: brandTeal }}
                  >
                    Área da conta
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-[18px] sm:flex-row sm:flex-wrap">
                  <Link
                    to="/cadastro/profissional"
                    className="inline-flex items-center justify-center gap-2 rounded-[15px] px-[30px] py-[18px] text-lg font-bold text-white transition-opacity hover:opacity-95"
                    style={{ backgroundColor: brandTeal }}
                  >
                    <Briefcase className="size-6 shrink-0" aria-hidden />
                    Sou profissional
                  </Link>
                  <Link
                    to="/cadastro/empresa"
                    className="inline-flex items-center justify-center gap-2 rounded-[15px] px-[30px] py-[18px] text-lg font-bold text-white transition-opacity hover:opacity-95"
                    style={{ backgroundColor: brandOrange }}
                  >
                    <Building2 className="size-6 shrink-0" aria-hidden />
                    Sou empresa
                  </Link>
                </div>
              )}
            </div>
            <div className="relative mx-auto w-full max-w-[451px] shrink-0 lg:mx-0 lg:ml-auto">
              <div
                className="relative aspect-square w-full overflow-hidden rounded-[23px] shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${brandTeal}22, ${brandOrange}18)`,
                }}
              >
                <img
                  src={heroImageSrc}
                  alt="Profissional experiente utilizando notebook"
                  className="size-full object-cover"
                  width={452}
                  height={452}
                />
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 lg:block"
            aria-hidden
          >
            <ArrowDownCircle
              className="size-20 opacity-40"
              style={{ color: brandTeal }}
              strokeWidth={1.25}
            />
          </div>
        </section>

        <section
          className={cn('relative py-16 sm:py-20 lg:py-24', pageGutter)}
          style={{ backgroundColor: sectionCream }}
        >
          <h2 className="mb-12 text-center text-3xl font-bold text-black lg:mb-14">
            Como funciona?
          </h2>
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-2 lg:gap-10">
            <article
              className="flex flex-col gap-5 rounded-[13px] bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] sm:p-7 lg:min-h-[329px] lg:max-w-[490px] lg:justify-center"
            >
              <div
                className="flex size-14 items-center justify-center rounded-[15px]"
                style={{ backgroundColor: iconBgPro }}
              >
                <UserRound className="size-7" style={{ color: brandTeal }} aria-hidden />
              </div>
              <h3 className="text-2xl font-bold text-black">Para Profissionais</h3>
              <p className="max-w-[421px] text-lg leading-relaxed text-black">
                Cadastre-se gratuitamente, complete seu perfil e candidate-se a vagas
                que valorizam sua experiência e trajetória
              </p>
              <Link
                to="/cadastro/profissional"
                className="mt-1 inline-flex h-[52px] w-full max-w-[227px] items-center justify-center rounded-2xl text-lg font-bold text-white transition-opacity hover:opacity-95"
                style={{ backgroundColor: brandTeal }}
              >
                Começar agora →
              </Link>
            </article>
            <article
              className="flex flex-col gap-5 rounded-[13px] bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] sm:p-7 lg:min-h-[329px] lg:max-w-[490px] lg:justify-center"
            >
              <div
                className="flex size-14 items-center justify-center rounded-[15px]"
                style={{ backgroundColor: iconBgCompany }}
              >
                <Building2 className="size-7" style={{ color: brandOrange }} aria-hidden />
              </div>
              <h3 className="text-2xl font-bold text-black">Para Empresas</h3>
              <p className="max-w-[421px] text-lg leading-relaxed text-black">
                Publique vagas e encontre profissionais experientes e qualificados.
                Recrute talentos com facilidade.
              </p>
              <Link
                to="/cadastro/empresa"
                className="mt-1 inline-flex h-[52px] w-full max-w-[227px] items-center justify-center rounded-2xl text-lg font-bold text-white transition-opacity hover:opacity-95"
                style={{ backgroundColor: brandOrange }}
              >
                Publicar vagas →
              </Link>
            </article>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
