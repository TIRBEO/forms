/**
 * Reference implementation for apps/api — GET/PATCH /api/preferences
 * Wire into catch-all router or standalone route handler.
 *
 * Requires: authenticated user session (userId from JWT/cookie)
 * Tables: users, user_settings (see 010 + 011 migrations)
 */

import { buildPreferencesResponse, mergePreferencesPatch, type DbUser, type DbUserSettings } from "../settings-service";

export type PreferencesDb = {
  getUser(userId: string): Promise<DbUser | null>;
  getUserSettings(userId: string): Promise<DbUserSettings | null>;
  updateUser(userId: string, data: Record<string, unknown>): Promise<DbUser>;
  upsertUserSettings(userId: string, data: Record<string, unknown>): Promise<DbUserSettings>;
};

export async function handleGetPreferences(db: PreferencesDb, userId: string) {
  const [user, settings] = await Promise.all([
    db.getUser(userId),
    db.getUserSettings(userId),
  ]);
  if (!user) return { status: 404, body: { error: "User not found" } };
  return { status: 200, body: buildPreferencesResponse(user, settings) };
}

export async function handlePatchPreferences(
  db: PreferencesDb,
  userId: string,
  rawBody: unknown,
) {
  const user = await db.getUser(userId);
  if (!user) return { status: 404, body: { error: "User not found" } };

  const settings = await db.getUserSettings(userId);
  let merged;
  try {
    merged = mergePreferencesPatch(user, settings, rawBody);
  } catch (err) {
    return { status: 400, body: { error: "Invalid preferences payload", details: String(err) } };
  }

  const [updatedUser, updatedSettings] = await Promise.all([
    db.updateUser(userId, merged.userUpdates),
    db.upsertUserSettings(userId, merged.settingsUpdates),
  ]);

  return {
    status: 200,
    body: buildPreferencesResponse(updatedUser, updatedSettings),
  };
}

/** Example Prisma-style adapter stub */
export function createPrismaPreferencesDb(prisma: {
  user: { findUnique: (args: object) => Promise<DbUser | null>; update: (args: object) => Promise<DbUser> };
  userSettings: { findUnique: (args: object) => Promise<DbUserSettings | null>; upsert: (args: object) => Promise<DbUserSettings> };
}): PreferencesDb {
  return {
    async getUser(userId) {
      return prisma.user.findUnique({ where: { id: userId } }) as Promise<DbUser | null>;
    },
    async getUserSettings(userId) {
      return prisma.userSettings.findUnique({ where: { user_id: userId } }) as Promise<DbUserSettings | null>;
    },
    async updateUser(userId, data) {
      return prisma.user.update({ where: { id: userId }, data }) as Promise<DbUser>;
    },
    async upsertUserSettings(userId, data) {
      return prisma.userSettings.upsert({
        where: { user_id: userId },
        create: { user_id: userId, ...data },
        update: data,
      }) as Promise<DbUserSettings>;
    },
  };
}
