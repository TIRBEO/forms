import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

export function createMiddlewareClient(request: Request): { supabase: SupabaseClient; response: Response } {
  const response = new Response();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: async () => {
        const cookieHeader = request.headers.get("cookie") || "";
        const cookies: { name: string; value: string }[] = [];
        cookieHeader.split(";").forEach((cookie) => {
          const [name, ...rest] = cookie.split("=");
          if (name && rest.length > 0) {
            cookies.push({ name: name.trim(), value: rest.join("=").trim() });
          }
        });
        return cookies;
      },
      setAll: async (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          const domain = cookieDomain ? `;Domain=${cookieDomain}` : '';
          const path = options?.path || "/";
          const secure = options?.secure ?? false;
          const sameSite = options?.sameSite || "lax";
          const cookieString = `${name}=${value}; Path=${path}${domain}${secure ? '; Secure' : ''}${sameSite ? `; SameSite=${sameSite}` : ''}`;
          response.headers.append("Set-Cookie", cookieString);
        });
      }
    },
  });
  return { supabase, response };
}