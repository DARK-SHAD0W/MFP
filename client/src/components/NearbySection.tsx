import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Address, Coordinates } from "../types";
import { getDistanceKm } from "../utils/geo";

type NearbySectionProps = {
  isAuthed: boolean;
  busyAction: string | null;
  radiusKm: string;
  setRadiusKm: Dispatch<SetStateAction<string>>;
  fromLat: string;
  fromLng: string;
  setFromLat: Dispatch<SetStateAction<string>>;
  setFromLng: Dispatch<SetStateAction<string>>;
  geoBusy: boolean;
  onUseLocation: () => void;
  onSearch: (event: FormEvent) => void | Promise<void>;
  onShowOrigin: () => void;
  nearby: Address[];
  origin: Coordinates | null;
};

export default function NearbySection({
  isAuthed,
  busyAction,
  radiusKm,
  setRadiusKm,
  fromLat,
  fromLng,
  setFromLat,
  setFromLng,
  geoBusy,
  onUseLocation,
  onSearch,
  onShowOrigin,
  nearby,
  origin,
}: NearbySectionProps) {
  return (
    <section className="grid two">
      <div className="card">
        <h2>Nearby search</h2>
        <form onSubmit={onSearch}>
          <label>
            Radius (km)
            <input
              type="number"
              min="0"
              step="0.1"
              value={radiusKm}
              onChange={(event) => setRadiusKm(event.target.value)}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Latitude
              <input
                type="number"
                step="0.000001"
                value={fromLat}
                onChange={(event) => setFromLat(event.target.value)}
                placeholder="48.8566"
                required
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="0.000001"
                value={fromLng}
                onChange={(event) => setFromLng(event.target.value)}
                placeholder="2.3522"
                required
              />
            </label>
          </div>
          <div className="actions">
            <button
              type="button"
              className="btn secondary"
              onClick={onUseLocation}
              disabled={geoBusy}
            >
              {geoBusy ? "Locating..." : "Use my location"}
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={onShowOrigin}
              disabled={!origin}
            >
              Show on map
            </button>
            <button
              className="btn"
              type="submit"
              disabled={!isAuthed || busyAction === "nearby"}
            >
              Search nearby
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <h2>Nearby results</h2>
          <span className="meta">{nearby.length} found</span>
        </div>
        {isAuthed ? (
          <ul className="list">
            {nearby.length === 0 ? (
              <li className="list-item">No nearby places yet.</li>
            ) : (
              nearby.map((address) => {
                const distance = origin ? getDistanceKm(address, origin) : null;
                return (
                  <li className="list-item" key={address.id}>
                    <div className="title">{address.name}</div>
                    {address.description && (
                      <div className="meta">{address.description}</div>
                    )}
                    <div className="meta">
                      Lat {address.lat.toFixed(4)} · Lng {address.lng.toFixed(4)}
                    </div>
                    {distance !== null && (
                      <div className="meta">Distance: {distance.toFixed(2)} km</div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        ) : (
          <p className="meta">Log in to run nearby searches.</p>
        )}
      </div>
    </section>
  );
}
