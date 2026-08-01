'use client';

import { ReactNode } from 'react';
import { hasPermission, type PermissionSet } from '@tirbeo/permissions';

export interface PermissionGateProps {
  permission: string;
  permissions: PermissionSet;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, permissions, children, fallback }: PermissionGateProps) {
  if (hasPermission(permissions, permission)) return <>{children}</>;
  return <>{fallback ?? null}</>;
}
