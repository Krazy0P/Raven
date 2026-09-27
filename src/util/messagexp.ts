import supabase from "@/util/supabase";

export interface UserExpData {
  xp: number;
  level: number;
  dirty: boolean;
  weekly_xp: number;
  lastActive?: number;
}

const MAX_CACHE_SIZE = 1000;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes of inactivity

const expCache = new Map<string, UserExpData>();

/**
 * Retrieves the cached experience data for a user in a guild, or loads it from Supabase.
 */
export async function getUserExp(
  userId: string,
  guildId: string,
): Promise<UserExpData | null> {
  const key = `${userId}:${guildId}`;
  const now = Date.now();

  const cached = expCache.get(key);
  if (cached) {
    cached.lastActive = now;
    return cached;
  }

  const { data, error } = await supabase
    .from("chat xp")
    .upsert(
      { user_id: userId, guild_id: guildId },
      { onConflict: "user_id,guild_id" },
    )
    .select()
    .single();

  if (error || !data) return null;

  const userEntry: UserExpData = {
    xp: data.xp ?? 0,
    weekly_xp: data.weekly_xp ?? data.xp ?? 0,
    level: data.level ?? 1,
    dirty: false,
    lastActive: now,
  };

  expCache.set(key, userEntry);
  return userEntry;
}

export async function flushUser(key: string, data: UserExpData) {
  if (!data.dirty) return;
  const [userId, guildId] = key.split(":");
  await supabase
    .from("chat xp")
    .update({ xp: data.xp, weekly_xp: data.weekly_xp, level: data.level })
    .eq("user_id", userId!)
    .eq("guild_id", guildId!);
  data.dirty = false;
}

// Periodic flush & eviction of inactive entries
setInterval(async () => {
  const now = Date.now();
  const entries = [...expCache.entries()];

  // Flush dirty entries in batches
  const dirty = entries.filter(([, v]) => v.dirty);
  for (let i = 0; i < dirty.length; i += 100) {
    const chunk = dirty.slice(i, i + 100);
    await Promise.all(chunk.map(([key, data]) => flushUser(key, data)));
  }

  // Evict entries inactive longer than TTL (only if not dirty)
  for (const [key, data] of entries) {
    if (!data.dirty && (data.lastActive ? now - data.lastActive > CACHE_TTL_MS : true)) {
      expCache.delete(key);
    }
  }

  // Enforce max cache size by evicting oldest active entries
  if (expCache.size > MAX_CACHE_SIZE) {
    const sorted = [...expCache.entries()].sort(
      (a, b) => (a[1].lastActive ?? 0) - (b[1].lastActive ?? 0),
    );
    for (const [key, data] of sorted) {
      if (expCache.size <= MAX_CACHE_SIZE) break;
      if (!data.dirty) {
        expCache.delete(key);
      }
    }
  }
}, 60_000);

export default expCache;
