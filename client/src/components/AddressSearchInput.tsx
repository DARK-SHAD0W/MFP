import { useEffect, useMemo, useRef, useState } from "react";
import type { Coordinates } from "../types";

type Suggestion = {
  label: string;
  coordinates: Coordinates;
};

type AddressSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (label: string, coords: Coordinates) => void;
  placeholder?: string;
  disabled?: boolean;
};

type GeocodeResponse = {
  features?: Array<{
    geometry?: {
      coordinates?: [number, number];
    };
    properties?: {
      label?: string;
    };
  }>;
};

export default function AddressSearchInput({
  value,
  onChange,
  onSelectSuggestion,
  placeholder,
  disabled,
}: AddressSearchInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const query = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    if (blurTimer.current) {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }

    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(
            query,
          )}&limit=6`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          setSuggestions([]);
          setOpen(false);
          return;
        }
        const data = (await response.json()) as GeocodeResponse;
        const next = (data.features ?? [])
          .map((feature) => {
            const coords = feature.geometry?.coordinates;
            const label = feature.properties?.label;
            if (!coords || coords.length !== 2 || !label) return null;
            return {
              label,
              coordinates: { lng: coords[0], lat: coords[1] },
            } satisfies Suggestion;
          })
          .filter((entry): entry is Suggestion => Boolean(entry));
        setSuggestions(next);
        setOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.label);
    onSelectSuggestion(suggestion.label, suggestion.coordinates);
    setOpen(false);
  };

  return (
    <div
      className="autocomplete"
      onFocus={() => suggestions.length > 0 && setOpen(true)}
      onBlur={() => {
        blurTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required
      />
      {open && (
        <div className="autocomplete-list" role="listbox">
          {loading && <div className="autocomplete-loading">Loading...</div>}
          {!loading && suggestions.length === 0 && (
            <div className="autocomplete-empty">No suggestions yet.</div>
          )}
          {!loading &&
            suggestions.map((suggestion) => (
              <button
                type="button"
                key={`${suggestion.label}-${suggestion.coordinates.lng}-${suggestion.coordinates.lat}`}
                className="autocomplete-item"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
