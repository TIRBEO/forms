export type User = {
  id: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown> | null;
  severity: 'info' | 'warning' | 'error' | 'critical';
  createdAt: string;
};

export type ApiKey = {
  id: string;
  userId: string;
  name: string;
  key: string;
  lastUsedAt: string | null;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export type Role = {
  id: string;
  name: string;
  slug: string;
  permissions: string[];
  createdAt: string;
};

export type Application = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive' | 'pending';
  iconUrl: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Device = {
  id: string;
  userId: string;
  name: string | null;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  lastActiveAt: string | null;
  createdAt: string;
};

export type OAuthAccount = {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type Setting = {
  id: string;
  key: string;
  value: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BackgroundJob = {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  data: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type ApiError = {
  code: string;
  message: string;
  details: Record<string, unknown> | null;
};

export type OrganizationRole = 'owner' | 'admin' | 'member' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';