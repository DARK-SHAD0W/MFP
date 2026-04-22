import { useState } from "react";
import type { Address, Coordinates } from "../types";

type ApiFetchFn = <T>(path: string, options?: RequestInit) => Promise<T>;

export function useNearbySearch(apiFetch: ApiFetchFn) {
  const [nearby, setNearby] = useState<Address[]>([]);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const search = async (
    from: Coordinates,
    radius: number,
    onSuccess: (count: number) => void,
    onError: (msg: string) => void,
  ) => {
    if (radius <= 0) {
      onError("Radius must be a positive number.");
      return;
    }

    setBusyAction("nearby");
    try {
      const data = await apiFetch<{ items: Address[] }>(
        "/api/addresses/searches",
        {
          method: "POST",
          body: JSON.stringify({ radius, from }),
        },
      );
      setNearby(data.items);
      onSuccess(data.items.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to search nearby places.";
      onError(message);
    } finally {
      setBusyAction(null);
    }
  };

  return {
    nearby,
    busyAction,
    search,
  };
}
