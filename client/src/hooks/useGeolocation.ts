import { useState } from "react";
import type { Coordinates } from "../types";

export function useGeolocation() {
  const [geoBusy, setGeoBusy] = useState(false);

  const requestLocation = (
    onSuccess: (coords: Coordinates) => void,
    onError: (msg: string) => void,
  ) => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported in this browser.");
      return;
    }

    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoBusy(false);
      },
      (error) => {
        setGeoBusy(false);
        onError(error.message || "Unable to read location.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    geoBusy,
    requestLocation,
  };
}
