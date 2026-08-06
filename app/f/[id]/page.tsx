'use client';

import { useParams } from 'next/navigation';
import { PublicFormFill } from '../../components/public-form';

// /f/{publicId} — fill URL for forms created by regular users (admin-created forms live at /a/).
export default function UserPublicFormPage() {
  const params = useParams();
  return <PublicFormFill publicId={params.id as string} />;
}
