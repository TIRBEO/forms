import {
  type PreferencesPatch,
  preferencesPatchSchema,
  userPreferencesJsonSchema,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_GENERAL_PREFERENCES,
  DEFAULT_ACCESSIBILITY,
  DEFAULT_LOCALE,
  privacySettingsSchema,
} from "./settings-schemas";

export type DbUser = {
  id: string;
  email: string;
  name?: string | null;
  theme?: string | null;
  language?: string | null;
  timezone?: string | null;
  date_format?: string | null;
  time_format?: string | null;
  font_size?: string | null;
  reduce_motion?: boolean;
  high_contrast?: boolean;
  preferences?: Record<string, unknown> | null;
  profile_visibility?: string | null;
};

export type DbUserSettings = {
  user_id: string;
  channel_master?: Record<string, boolean> | null;
  category_prefs?: Record<string, unknown> | null;
  digest_frequency?: string | null;
  profile_visibility?: string | null;
  show_online_status?: boolean | null;
  allow_dms?: boolean | null;
  searchable?: boolean | null;
  show_open_to_publicly?: boolean | null;
  ad_personalization?: boolean | null;
  message_visibility?: string | null;
  connections_visibility?: string | null;
  show_read_receipts?: boolean | null;
  activity_broadcasting?: boolean | null;
  accessibility?: Record<string, unknown> | null;
  locale?: Record<string, unknown> | null;
  general?: Record<string, unknown> | null;
  cookie_prefs?: Record<string, boolean> | null;
  sidebar_collapsed?: boolean | null;
  compact_mode?: boolean | null;
  default_page?: string | null;
};

/** API response shape for GET /api/preferences */
export function buildPreferencesResponse(user: DbUser, settings?: DbUserSettings | null) {
  const prefs = userPreferencesJsonSchema.parse(user.preferences ?? {});
  const s = settings ?? null;

  return {
    theme: user.theme ?? prefs.themeMode ?? "system",
    themeMode: prefs.themeMode ?? user.theme ?? "system",
    language: user.language ?? prefs.locale?.language ?? DEFAULT_LOCALE.language,
    timezone: user.timezone ?? prefs.locale?.timezone ?? DEFAULT_LOCALE.timezone,
    dateFormat: user.date_format ?? prefs.locale?.dateFormat ?? DEFAULT_LOCALE.dateFormat,
    timeFormat: user.time_format === "24h" ? "24h" : "12h",
    fontSize: user.font_size ?? "medium",
    reduceMotion: user.reduce_motion ?? prefs.accessibility?.reduceMotion ?? false,
    highContrast: user.high_contrast ?? prefs.accessibility?.highContrast ?? false,
    profileVisible: (s?.profile_visibility ?? user.profile_visibility ?? "public") !== "private",
    searchable: s?.searchable ?? true,
    preferences: {
      ...prefs,
      themeId: prefs.themeId ?? "midnight",
      accentColor: prefs.accentColor ?? "indigo",
      notifications: {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        channels: {
          email: s?.channel_master?.email ?? true,
          push: s?.channel_master?.push ?? true,
          inApp: s?.channel_master?.in_app ?? s?.channel_master?.inApp ?? true,
          sms: s?.channel_master?.sms ?? false,
        },
        digestFrequency: (s?.digest_frequency as typeof DEFAULT_NOTIFICATION_SETTINGS.digestFrequency) ?? "daily",
        ...(prefs.notifications ?? {}),
        ...(s?.category_prefs as object ?? {}),
      },
      general: { ...DEFAULT_GENERAL_PREFERENCES, ...(s?.general ?? {}), ...(prefs.general ?? {}) },
      accessibility: {
        ...DEFAULT_ACCESSIBILITY,
        reduceMotion: user.reduce_motion ?? false,
        highContrast: user.high_contrast ?? false,
        ...(s?.accessibility ?? {}),
        ...(prefs.accessibility ?? {}),
      },
      locale: {
        ...DEFAULT_LOCALE,
        language: user.language ?? DEFAULT_LOCALE.language,
        timezone: user.timezone ?? DEFAULT_LOCALE.timezone,
        dateFormat: user.date_format ?? DEFAULT_LOCALE.dateFormat,
        timeFormat: user.time_format === "12h" ? "12h" : "24h",
        ...(s?.locale ?? {}),
        ...(prefs.locale ?? {}),
      },
      cookies: s?.cookie_prefs ?? prefs.cookies ?? { essential: true, analytics: false, marketing: false },
    },
    privacy: prefs.privacy ?? mapDbPrivacy(settings),
  };
}

function mapDbPrivacy(s: DbUserSettings | null | undefined) {
  if (!s) return undefined;
  return privacySettingsSchema.partial().parse({
    showOnlineStatus: s.show_online_status,
    allowReadReceipts: s.show_read_receipts,
    allowSearchEngines: s.searchable,
    personalizedRecommendations: s.ad_personalization,
    profileVisibility: s.profile_visibility,
    messageVisibility: s.message_visibility,
    connectionsVisibility: s.connections_visibility,
  });
}

/** Merge PATCH into user row + user_settings updates */
export function mergePreferencesPatch(
  user: DbUser,
  settings: DbUserSettings | null,
  rawPatch: unknown,
): { userUpdates: Record<string, unknown>; settingsUpdates: Record<string, unknown>; preferences: Record<string, unknown> } {
  const patch = preferencesPatchSchema.parse(rawPatch);
  const existingPrefs = userPreferencesJsonSchema.parse(user.preferences ?? {});
  const mergedPrefs = {
    ...existingPrefs,
    ...patch.preferences,
    ...(patch.privacy ? { privacy: { ...(existingPrefs.privacy ?? {}), ...patch.privacy } } : {}),
    ...(patch.preferences?.notifications
      ? {
          notifications: {
            ...((existingPrefs.notifications as Record<string, unknown>) ?? {}),
            ...((patch.preferences.notifications as Record<string, unknown>) ?? {}),
            channels: {
              ...((existingPrefs.notifications as Record<string, unknown>)?.channels ?? {}),
              ...((patch.preferences.notifications as Record<string, unknown>)?.channels ?? {}),
            },
          },
        }
      : {}),
  };

  const userUpdates: Record<string, unknown> = {
    preferences: mergedPrefs,
  };

  if (patch.theme !== undefined) userUpdates.theme = patch.theme;
  if (patch.themeMode !== undefined) {
    userUpdates.theme = patch.themeMode;
    mergedPrefs.themeMode = patch.themeMode;
  }
  if (patch.language !== undefined) userUpdates.language = patch.language;
  if (patch.timezone !== undefined) userUpdates.timezone = patch.timezone;
  if (patch.dateFormat !== undefined) userUpdates.date_format = patch.dateFormat;
  if (patch.timeFormat !== undefined) userUpdates.time_format = patch.timeFormat;
  if (patch.fontSize !== undefined) userUpdates.font_size = patch.fontSize;
  if (patch.reduceMotion !== undefined) userUpdates.reduce_motion = patch.reduceMotion;
  if (patch.highContrast !== undefined) userUpdates.high_contrast = patch.highContrast;

  const settingsUpdates: Record<string, unknown> = {};
  const n = mergedPrefs.notifications as {
    channels?: { email?: boolean; push?: boolean; inApp?: boolean; sms?: boolean };
    digestFrequency?: string;
  } | undefined;

  if (n?.channels && typeof n.channels === 'object') {
    const channels = n.channels;
    settingsUpdates.channel_master = {
      email: channels.email ?? true,
      push: channels.push ?? true,
      in_app: channels.inApp ?? true,
      sms: channels.sms ?? false,
    };
  }
  if (n?.digestFrequency) settingsUpdates.digest_frequency = n.digestFrequency;
  if (mergedPrefs.general) settingsUpdates.general = mergedPrefs.general;
  if (mergedPrefs.accessibility) settingsUpdates.accessibility = mergedPrefs.accessibility;
  if (mergedPrefs.locale) settingsUpdates.locale = mergedPrefs.locale;
  if (mergedPrefs.cookies) settingsUpdates.cookie_prefs = mergedPrefs.cookies;
  if (patch.privacy) {
    const p = patch.privacy;
    if (p.profileVisibility) settingsUpdates.profile_visibility = p.profileVisibility;
    if (p.messageVisibility) settingsUpdates.message_visibility = p.messageVisibility;
    if (p.connectionsVisibility) settingsUpdates.connections_visibility = p.connectionsVisibility;
    if (p.allowSearchEngines !== undefined) settingsUpdates.searchable = p.allowSearchEngines;
    if (p.personalizedRecommendations !== undefined) settingsUpdates.ad_personalization = p.personalizedRecommendations;
    if (p.showOnlineStatus !== undefined) settingsUpdates.show_online_status = p.showOnlineStatus;
    if (p.allowReadReceipts !== undefined) settingsUpdates.show_read_receipts = p.allowReadReceipts;
  }

  return { userUpdates, settingsUpdates, preferences: mergedPrefs };
}
