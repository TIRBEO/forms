import { getCache, setCache } from "./redis";
import { prisma } from "@tirbeo/database";

const WORKSPACE_CACHE_TTL = 300;

export async function getWorkspaceBySlug(slug: string) {
  const cacheKey = `workspace:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const ws = await prisma.workspace.findUnique({ where: { slug } });
  if (ws) {
    await setCache(cacheKey, JSON.stringify(ws), WORKSPACE_CACHE_TTL);
  }
  return ws;
}