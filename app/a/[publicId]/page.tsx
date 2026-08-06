'use client';

import { useParams } from 'next/navigation';
import { PublicFormFill } from '../../components/public-form';

// /a/{publicId} — fill URL for forms created from the admin panel.
export default function AdminPublicFormPage() {
  const params = useParams();
  return <PublicFormFill publicId={params.publicId as string} />;
}
