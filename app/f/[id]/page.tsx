'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function FormRedirect() {
  const params = useParams();
  const router = useRouter();
  useEffect(() => { router.replace(`/f/${params.id}/overview`); }, [params.id, router]);
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
    </div>
  );
}
