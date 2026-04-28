import { Link } from 'react-router-dom';

const footerMuted = '#575757';

const linkClass =
  'text-base transition-opacity hover:opacity-80';

export function MarketingFooter() {
  return (
    <footer
      className="bg-background border-border/40 border-t shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
      style={{ color: footerMuted }}
    >
      <div className="mx-auto flex min-h-[88px] max-w-[1440px] flex-wrap items-center justify-center gap-x-[18px] gap-y-3 px-4 py-6 sm:px-8 lg:px-[min(220px,12vw)]">
        <p className="text-base">© 2026 Trilha 50+ Ltd.</p>
        <Link to="#" className={linkClass} style={{ color: footerMuted }}>
          Termos e Condições
        </Link>
        <Link to="#" className={linkClass} style={{ color: footerMuted }}>
          Política de Privacidade
        </Link>
        <Link to="#" className={linkClass} style={{ color: footerMuted }}>
          Política de Cookies
        </Link>
      </div>
    </footer>
  );
}
