import type { Coordinates } from "../types";

type ReverseGeocodeResponse = {
  features?: Array<{
    properties?: {
      label?: string;
    };
  }>;
};

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function getDistanceKm(
  point1: Coordinates,
  point2: Coordinates,
): number {
  const earthRadius = 6371;
  const diffLat = ((point1.lat - point2.lat) * Math.PI) / 180;
  const diffLng = ((point1.lng - point2.lng) * Math.PI) / 180;
  const arc =
    Math.cos((point2.lat * Math.PI) / 180) *
      Math.cos((point1.lat * Math.PI) / 180) *
      Math.sin(diffLng / 2) *
      Math.sin(diffLng / 2) +
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
  const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
  return earthRadius * line;
}

export async function reverseGeocode(
  coords: Coordinates,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://data.geopf.fr/geocodage/reverse?lon=${coords.lng}&lat=${coords.lat}`,
    );
    if (!response.ok) return null;
    const data = await safeJson<ReverseGeocodeResponse>(response);
    return data?.features?.[0]?.properties?.label ?? null;
  } catch {
    return null;
  }
}
