import { z } from "zod";

/** Visibility enum shared across profile / privacy settings */
export const visibilitySchema = z.enum(["everyone", "connections", "none", "public", "private"]);
export type Visibility = z.infer<typeof visibilitySchema>;

export const digestFrequencySchema = z.enum(["realtime", "daily", "weekly", "off"]);

export const channelMasterSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
  sms: z.boolean().default(false),
}).passthrough();

export const notificationCategorySchema = z.object({
  newFollower: z.boolean().optional(),
  messages: z.boolean().optional(),
  mentions: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  productNews: z.boolean().optional(),
});

export const notificationSettingsSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    push: z.boolean(),
    inApp: z.boolean(),
    sms: z.boolean(),
  }),
  newFollower: z.boolean().optional(),
  messages: z.boolean().optional(),
  mentions: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  productNews: z.boolean().optional(),
  digestFrequency: digestFrequencySchema.optional(),
});

export const generalPreferencesSchema = z.object({
  defaultLanding: z.enum(["home", "profile", "feed"]).default("home"),
  defaultPostVisibility: z.enum(["public", "connections"]).default("public"),
  defaultIdeaVisibility: z.enum(["public", "private", "draft"]).default("draft"),
  autoplayVideos: z.boolean().default(true),
  linkPreviews: z.boolean().default(true),
  smartCompose: z.boolean().default(true),
  confirmUnsaved: z.boolean().default(true),
  compactNavigation: z.boolean().default(false),
  autoRefresh: z.boolean().default(true),
});

export const accessibilitySettingsSchema = z.object({
  screenReaderOpt: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  underlineLinks: z.boolean().default(false),
  keyboardHints: z.boolean().default(true),
  captionDefault: z.boolean().default(false),
  textSpacing: z.enum(["default", "comfortable", "relaxed", "maximum"]).default("default"),
});

export const localeSettingsSchema = z.object({
  language: z.string().default("en"),
  timezone: z.string().default("Asia/Kathmandu"),
  dateFormat: z.string().default("yyyy-MM-dd"),
  timeFormat: z.enum(["12h", "24h"]).default("24h"),
  region: z.string().default("NP"),
  measurementUnits: z.enum(["metric", "imperial"]).default("metric"),
  autoTranslate: z.boolean().default(true),
  contentLanguages: z.array(z.string()).optional(),
});

export const appearanceSettingsSchema = z.object({
  themeMode: z.enum(["light", "dark", "system"]).default("system"),
  themeId: z.string().default("midnight"),
  accentColor: z.string().default("indigo"),
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  fontFamily: z.enum(["inter", "dyslexic", "system"]).default("inter"),
  sidebarLayout: z.enum(["expanded", "collapsed", "icons"]).default("expanded"),
  feedLayout: z.enum(["card", "compact", "list"]).default("card"),
  backgroundPattern: z.boolean().default(true),
});

export const privacySettingsSchema = z.object({
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  showLocation: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
  showActivityStatus: z.boolean().default(true),
  allowReadReceipts: z.boolean().default(true),
  showLastActive: z.boolean().default(true),
  allowAnalytics: z.boolean().default(false),
  allowCrashReports: z.boolean().default(true),
  personalizedRecommendations: z.boolean().default(false),
  allowSearchEngines: z.boolean().default(true),
  showInDirectory: z.boolean().default(true),
  profileVisibility: visibilitySchema.optional(),
  messageVisibility: visibilitySchema.optional(),
  connectionsVisibility: visibilitySchema.optional(),
});

export const cookiePrefsSchema = z.object({
  essential: z.literal(true).default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

/** Nested JSON stored in users.preferences */
export const userPreferencesJsonSchema = z.object({
  themeId: z.string().optional(),
  themeMode: z.string().optional(),
  accentColor: z.string().optional(),
  notifications: notificationSettingsSchema.partial().optional(),
  general: generalPreferencesSchema.partial().optional(),
  accessibility: accessibilitySettingsSchema.partial().optional(),
  locale: localeSettingsSchema.partial().optional(),
  privacy: privacySettingsSchema.partial().optional(),
  cookies: cookiePrefsSchema.partial().optional(),
}).passthrough();

/** PATCH body for GET/PATCH /api/preferences */
export const preferencesPatchSchema = z.object({
  theme: z.string().optional(),
  themeMode: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  timeFormat: z.string().optional(),
  fontSize: z.string().optional(),
  reduceMotion: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  preferences: userPreferencesJsonSchema.optional(),
  privacy: privacySettingsSchema.partial().optional(),
}).strict();

export type PreferencesPatch = z.infer<typeof preferencesPatchSchema>;
export type UserPreferencesJson = z.infer<typeof userPreferencesJsonSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type GeneralPreferences = z.infer<typeof generalPreferencesSchema>;
export type AccessibilitySettings = z.infer<typeof accessibilitySettingsSchema>;
export type LocaleSettings = z.infer<typeof localeSettingsSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  channels: { email: true, push: true, inApp: true, sms: false },
  newFollower: true,
  messages: true,
  mentions: true,
  securityAlerts: true,
  productNews: false,
  digestFrequency: "daily",
};

export const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  defaultLanding: "home",
  defaultPostVisibility: "public",
  defaultIdeaVisibility: "draft",
  autoplayVideos: true,
  linkPreviews: true,
  smartCompose: true,
  confirmUnsaved: true,
  compactNavigation: false,
  autoRefresh: true,
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  screenReaderOpt: false,
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
  keyboardHints: true,
  captionDefault: false,
  textSpacing: "default",
};

export const DEFAULT_LOCALE: LocaleSettings = {
  language: "en",
  timezone: "Asia/Kathmandu",
  dateFormat: "yyyy-MM-dd",
  timeFormat: "24h",
  region: "NP",
  measurementUnits: "metric",
  autoTranslate: true,
};
