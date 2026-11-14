import type { ProgressData, TeamProfile } from "@/Types";

export const sanitizeTeam = (value: unknown): TeamProfile | null => {
  if (!value || typeof value !== "object") return null;
  const team = value as Record<string, unknown>;
  if (typeof team.name !== "string" || !team.name.trim() || team.name.trim().length > 32)
    return null;
  if (
    team.icon !== "rocket" &&
    team.icon !== "cat" &&
    team.icon !== "flame" &&
    team.icon !== "turtle"
  )
    return null;
  return { name: team.name.trim(), icon: team.icon };
};

const stringIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === "string" && id.length > 0))]
    : [];

export const sanitizeProgress = (value: unknown): ProgressData => {
  const data =
    value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawSolved =
    data.solved !== null && typeof data.solved === "object"
      ? (data.solved as Record<string, unknown>)
      : {};
  const solved = Object.fromEntries(
    ["plant", "animal", "bacteria"].map((city) => [city, stringIds(rawSolved[city])]),
  );
  const lastPath =
    typeof data.lastPath === "string" &&
    /^\/(?:miasto\/(?:plant|animal|bacteria)|powtorka)?$/.test(data.lastPath)
      ? data.lastPath
      : "/";

  return { solved, review: stringIds(data.review), lastPath, team: sanitizeTeam(data.team) };
};
