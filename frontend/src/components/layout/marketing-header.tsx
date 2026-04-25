import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const brandTeal = '#00686A';

export function MarketingHeader() {
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);
  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-50',
        'shadow-[0px_2px_3.2px_rgba(0,0,0,0.25)]',
      )}
    >
      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-[min(220px,12vw)]">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span
            className="flex size-[42px] shrink-0 items-center justify-center rounded-[15px] text-base font-bold tracking-[0.03em] text-white"
            style={{ backgroundColor: brandTeal }}
          >
            T
          </span>
          <span className="text-[19px] font-bold tracking-[0.03em] text-black">
            Trilha <span style={{ color: brandTeal }}>50+</span>
          </span>
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden text-sm font-medium sm:inline">
              {session.displayName}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => clearSession()}>
              Sair
            </Button>
          </div>
        ) : (
          <Link
            to="/entrar"
            className={cn(
              'inline-flex h-11 min-w-[96px] items-center justify-center rounded-[14px] px-[22px] text-base font-bold tracking-[0.03em] text-white transition-opacity hover:opacity-95',
            )}
            style={{ backgroundColor: brandTeal }}
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
