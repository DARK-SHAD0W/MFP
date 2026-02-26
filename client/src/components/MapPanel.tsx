import type { Coordinates } from "../types";

type MapPanelProps = {
  coordinates: Coordinates | null;
  title: string;
  addressLabel?: string | null;
};

function buildMapSrc(coords: Coordinates): string {
  const delta = 0.01;
  const left = coords.lng - delta;
  const right = coords.lng + delta;
  const top = coords.lat + delta;
  const bottom = coords.lat - delta;
  const bbox = `${left},${bottom},${right},${top}`;
  const marker = `${coords.lat},${coords.lng}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${encodeURIComponent(marker)}`;
}

function buildMapLink(coords: Coordinates): string {
  return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`;
}

export default function MapPanel({ coordinates, title, addressLabel }: MapPanelProps) {
  return (
    <div className="card map-card">
      <div className="card-title">
        <h2>Map</h2>
        <span className="meta">{title}</span>
      </div>
      {coordinates ? (
        <>
          <div className="map-frame">
            <iframe
              title="map"
              src={buildMapSrc(coordinates)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="stack">
            <div className="meta">
              Lat {coordinates.lat.toFixed(5)} · Lng {coordinates.lng.toFixed(5)}
            </div>
            {addressLabel && <div className="title">{addressLabel}</div>}
            <a className="link" href={buildMapLink(coordinates)} target="_blank" rel="noreferrer">
              Open in OpenStreetMap
            </a>
          </div>
        </>
      ) : (
        <div className="map-placeholder">
          Select a place or set an origin to preview it on the map.
        </div>
      )}
    </div>
  );
}
