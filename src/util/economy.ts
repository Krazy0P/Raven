import supabase from "@/util/supabase";


export async function getOrCreateUser(userId: string) {
  const { data } = await supabase
    .from("economy")
    .upsert({ user_id: userId }, { onConflict: "user_id" })
    .select()
    .single();

  return data!;
}

export async function addToWallet(userId: string, amount: number) {
  const user = await getOrCreateUser(userId);
  await supabase
    .from("economy")
    .update({ wallet: user.wallet! + amount })
    .eq("user_id", userId);
}

export async function removeFromWallet(userId: string, amount: number) {
  const user = await getOrCreateUser(userId);
  if (user.wallet! < amount) return false;
  await supabase
    .from("economy")
    .update({ wallet: user.wallet! - amount })
    .eq("user_id", userId);
  return true;
}

export function formatCoins(amount: number): string {
  return ` 🪙 ${amount.toLocaleString()}`;
}

export function isOnCooldown(
  lastUsed: string | null,
  cooldownMs: number,
): number {
  if (!lastUsed) return 0;
  const diff = Date.now() - new Date(lastUsed).getTime();
  if (diff < cooldownMs) return cooldownMs - diff;
  return 0;
}

export function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  return midnight.getTime() - now.getTime();
}

export function formatCooldown(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
