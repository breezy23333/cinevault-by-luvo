'use client';

import Sidebar from '@/components/Sidebar';

export default function Shell({
  navbar,
  children,
}: {
  navbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#151a33] to-[#0a0d1a] text-white">
      
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="flex items-center gap-2 px-4 h-14">
          <div className="flex-1">{navbar}</div>
        </div>
      </div>

      {/* Layout */}
      <div className="relative">
        <Sidebar />

        <main className="transition-[margin] duration-300">
          <div className="px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
