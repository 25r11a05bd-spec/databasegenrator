"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/schema');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div className="space-y-3">
        <div className="inline-block animate-spin text-3xl">⚡</div>
        <p className="text-gray-300 font-medium">Redirecting to the Unified Schema Builder...</p>
      </div>
    </div>
  );
}
