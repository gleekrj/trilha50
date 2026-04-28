import { Outlet } from 'react-router-dom';

import { MarketingHeader } from '@/components/layout/marketing-header';

const shellBg = '#FCFAF4';
const cardBorder = '#E2DDD3';

export function AuthShell() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: shellBg }}>
      <MarketingHeader />
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-12">
        <div
          className="text-card-foreground w-full max-w-[446px] rounded-[16px] border bg-white px-6 py-8 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] sm:px-8 sm:py-9"
          style={{ borderColor: cardBorder }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
