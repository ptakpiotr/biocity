import { useSyncExternalStore } from "react";
import {
  getInitialPlacesSnapshot,
  getPlacesSnapshot,
  subscribeToPlaces,
} from "@/store/placesStore";

export const usePlaces = () => {
  const snapshot = useSyncExternalStore(
    subscribeToPlaces,
    getPlacesSnapshot,
    getInitialPlacesSnapshot,
  );

  return snapshot;
};
