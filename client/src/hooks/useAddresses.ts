import { useState } from "react";
import type { Address } from "../types";

type ApiFetchFn = <T>(path: string, options?: RequestInit) => Promise<T>;

export function useAddresses(apiFetch: ApiFetchFn) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const load = async (onError: (msg: string) => void) => {
    setBusyAction("addresses");
    try {
      const data = await apiFetch<{ items: Address[] }>("/api/addresses");
      setAddresses(data.items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load addresses.";
      onError(message);
    } finally {
      setBusyAction(null);
    }
  };

  const create = async (
    name: string,
    description: string | null,
    searchWord: string,
    onSuccess: (address: Address) => void,
    onError: (msg: string) => void,
  ) => {
    setBusyAction("create");
    try {
      const data = await apiFetch<{ item: Address }>("/api/addresses", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: description || null,
          searchWord,
        }),
      });
      setAddresses((current) => [data.item, ...current]);
      onSuccess(data.item);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add place.";
      onError(message);
    } finally {
      setBusyAction(null);
    }
  };

  return {
    addresses,
    busyAction,
    load,
    create,
  };
}
