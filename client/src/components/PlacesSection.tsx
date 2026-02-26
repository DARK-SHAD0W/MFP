import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Address, Coordinates } from "../types";
import { getDistanceKm } from "../utils/geo";
import AddressSearchInput from "./AddressSearchInput";

type PlacesSectionProps = {
  isAuthed: boolean;
  busyAction: string | null;
  placeName: string;
  placeDescription: string;
  placeSearch: string;
  setPlaceName: Dispatch<SetStateAction<string>>;
  setPlaceDescription: Dispatch<SetStateAction<string>>;
  setPlaceSearch: Dispatch<SetStateAction<string>>;
  onCreateAddress: (event: FormEvent) => void | Promise<void>;
  addresses: Address[];
  origin: Coordinates | null;
  onUseOrigin: (coords: Coordinates) => void;
  onSelectPlace: (address: Address) => void;
  onPreviewSearch: (coords: Coordinates, label: string) => void;
  selectedPlaceId: number | null;
};

export default function PlacesSection({
  isAuthed,
  busyAction,
  placeName,
  placeDescription,
  placeSearch,
  setPlaceName,
  setPlaceDescription,
  setPlaceSearch,
  onCreateAddress,
  addresses,
  origin,
  onUseOrigin,
  onSelectPlace,
  onPreviewSearch,
  selectedPlaceId,
}: PlacesSectionProps) {
  return (
    <section className="grid two">
      <div className="card">
        <h2>Save a new place</h2>
        <form onSubmit={onCreateAddress}>
          <label>
            Place name
            <input
              type="text"
              value={placeName}
              onChange={(event) => setPlaceName(event.target.value)}
              placeholder="Home, Office, Favorite cafe"
              required
            />
          </label>
          <label>
            Search address
            <AddressSearchInput
              value={placeSearch}
              onChange={setPlaceSearch}
              onSelectSuggestion={(label, coords) => onPreviewSearch(coords, label)}
              placeholder="12 Rue de Rivoli, Paris"
              disabled={!isAuthed}
            />
          </label>
          <label>
            Description
            <textarea
              value={placeDescription}
              onChange={(event) => setPlaceDescription(event.target.value)}
              placeholder="Optional details about this place"
            />
          </label>
          <button
            className="btn"
            type="submit"
            disabled={!isAuthed || busyAction === "create"}
          >
            Save place
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <h2>My places</h2>
          <span className="meta">{addresses.length} saved</span>
        </div>
        {isAuthed ? (
          <ul className="list">
            {addresses.length === 0 ? (
              <li className="list-item">No places yet. Add one.</li>
            ) : (
              addresses.map((address) => {
                const distance = origin ? getDistanceKm(address, origin) : null;
                const isSelected = selectedPlaceId === address.id;
                return (
                  <li
                    className={`list-item${isSelected ? " active" : ""}`}
                    key={address.id}
                  >
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
                    <div className="meta">
                      Added {new Date(address.createdAt).toLocaleString()}
                    </div>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="chip"
                        onClick={() => onUseOrigin({ lat: address.lat, lng: address.lng })}
                      >
                        Use for nearby
                      </button>
                      <button
                        type="button"
                        className="chip"
                        onClick={() => onSelectPlace(address)}
                      >
                        View on map
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        ) : (
          <p className="meta">Log in to see your saved addresses.</p>
        )}
      </div>
    </section>
  );
}
