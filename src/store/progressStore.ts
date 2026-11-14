import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { progressStorage } from "@/store/progressStorage";
import { sanitizeProgress, sanitizeTeam } from "@/lib/progressPersistence";
import type { Progress } from "@/Types";
export const useProgress = create<Progress>()(
  persist(
    (set) => ({
      resetVersion: 0,
      team: null,
      setTeam: (team) => set({ team: sanitizeTeam(team) }),
      solved: {},
      review: [],
      lastPath: "/",
      solve: (city, id) =>
        set((s) => ({
          solved: {
            ...s.solved,
            [city]: [...new Set([...(s.solved[city] ?? []), id])],
          },
        })),
      solveReview: (id) =>
        set((s) => ({
          review: [...new Set([...s.review, id])],
        })),
      visit: (lastPath) =>
        set({
          lastPath,
        }),
      reset: () =>
        set((state) => ({
          resetVersion: state.resetVersion + 1,
          solved: {},
          review: [],
          lastPath: "/",
        })),
    }),
    {
      name: "biocity-progress-v2",
      storage: createJSONStorage(() => progressStorage.storage),
      merge: (persisted, current) => ({ ...current, ...sanitizeProgress(persisted) }),
      partialize: ({ solved, review, lastPath, team }) => ({ solved, review, lastPath, team }),
    },
  ),
);
