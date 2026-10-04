import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In • DB-Generator Studio',
  description: 'Sign in to deploy & orchestrate AI-assisted PostgreSQL schemas with DB-Generator Studio',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07060d] text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {children}
    </div>
  );
}
