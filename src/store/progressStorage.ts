import { createResilientStorage } from "@/lib/resilientStorage";

export const progressStorage = createResilientStorage(() => localStorage);
