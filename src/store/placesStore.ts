import type { PlacesSnapshot, StoreListener } from "@/Types";
import { loadPlaces, observePlaces } from "@/lib/database";

const initialSnapshot: PlacesSnapshot = { places: [], loading: true, error: false };
let snapshot = initialSnapshot;
const listeners = new Set<StoreListener>();
let stopObserving: StoreListener | undefined;

const publish = (next: PlacesSnapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};

const startObserving = (): StoreListener => {
  let active = true;
  const query = observePlaces();
  let subscription: ReturnType<typeof query.subscribe> | undefined;

  void loadPlaces()
    .then(() => {
      if (!active) return;
      subscription = query.subscribe({
        next: (places) => {
          if (active) publish({ places, loading: false, error: false });
        },
        error: () => {
          if (active) publish({ ...snapshot, loading: false, error: true });
        },
      });
    })
    .catch(() => {
      if (active) publish({ ...snapshot, loading: false, error: true });
    });

  return () => {
    active = false;
    subscription?.unsubscribe();
  };
};

export const subscribeToPlaces = (listener: StoreListener): StoreListener => {
  const notify = () => listener();
  listeners.add(notify);
  if (listeners.size === 1) stopObserving = startObserving();

  return () => {
    if (!listeners.delete(notify)) return;
    if (listeners.size === 0) {
      stopObserving?.();
      stopObserving = undefined;
    }
  };
};

export const getPlacesSnapshot = (): PlacesSnapshot => snapshot;
export const getInitialPlacesSnapshot = (): PlacesSnapshot => initialSnapshot;
