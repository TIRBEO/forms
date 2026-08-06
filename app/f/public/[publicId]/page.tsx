'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Old public URL ( /f/public/{publicId}-public ) now redirects to the
// cleaner /a/{publicId} fill URL so previously shared links keep working.
export default function LegacyPublicFormRedirect() {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    const raw = (params.publicId as string) || '';
    const publicId = raw.replace(/-public$/, '');
    router.replace(`/a/${publicId}`);
  }, [params.publicId, router]);
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
    </div>
  );
}
