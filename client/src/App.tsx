import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Address, Coordinates, Notice, User } from "./types";
import AuthPage from "./components/AuthPage";
import MapPanel from "./components/MapPanel";
import NearbySection from "./components/NearbySection";
import NoticeBanner from "./components/NoticeBanner";
import PlacesSection from "./components/PlacesSection";
import TopBar from "./components/TopBar";
import UserCard from "./components/UserCard";

const TOKEN_KEY = "mfp_token";

type AuthMode = "signin" | "signup";

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

function toNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [me, setMe] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [nearby, setNearby] = useState<Address[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [placeName, setPlaceName] = useState("");
  const [placeDescription, setPlaceDescription] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");

  const [radiusKm, setRadiusKm] = useState("2");
  const [fromLat, setFromLat] = useState("");
  const [fromLng, setFromLng] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState<Address | null>(null);
  const [addressLabels, setAddressLabels] = useState<Record<number, string>>({});
  const [mapTarget, setMapTarget] = useState<Coordinates | null>(null);
  const [mapTitle, setMapTitle] = useState("Map preview");
  const [searchPreviewLabel, setSearchPreviewLabel] = useState<string | null>(null);

  const isAuthed = Boolean(token);
  const origin = useMemo<Coordinates | null>(() => {
    const lat = toNumber(fromLat);
    const lng = toNumber(fromLng);
    if (lat === null || lng === null) return null;
    return { lat, lng };
  }, [fromLat, fromLng]);

  useEffect(() => {
    if (token) {
      void loadMe();
      void loadAddresses();
    } else {
      setMe(null);
      setAddresses([]);
      setNearby([]);
      setSelectedPlace(null);
      setMapTarget(null);
      setMapTitle("Map preview");
      setSearchPreviewLabel(null);
    }
  }, [token]);

  useEffect(() => {
    if (notice) {
      const timer = window.setTimeout(() => setNotice(null), 6000);
      return () => window.clearTimeout(timer);
    }
    return;
  }, [notice]);

  // Ensure the app favicon uses /favicon.ico (prevents default or cached icons)
  useEffect(() => {
    try {
      const setFavicon = (href: string) => {
        const head = document.getElementsByTagName("head")[0];
        let link = head.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          head.appendChild(link);
        }
        if (link.href !== href) {
          link.href = href;
        }
      };

      setFavicon("/favicon.ico");
    } catch {
      // ignore in non-browser environments
    }
  }, []);

  const apiFetch = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(path, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await safeJson<T & { message?: string }>(response);

    if (!response.ok) {
      const message = data?.message || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data as T;
  };

  const reverseGeocode = async (coords: Coordinates): Promise<string | null> => {
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
  };

  const withBusy = async (name: string, action: () => Promise<void>) => {
    setBusyAction(name);
    setNotice(null);
    try {
      await action();
    } finally {
      setBusyAction(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setNotice({ type: "info", message: "Logged out." });
  };

  const loadMe = async () => {
    await withBusy("me", async () => {
      try {
        const data = await apiFetch<{ item: User }>("/api/users/me");
        setMe(data.item);
      } catch (error) {
        setMe(null);
        const message = error instanceof Error ? error.message : "Unable to fetch user.";
        if (message === "access denied") {
          handleLogout();
        } else {
          setNotice({ type: "error", message });
        }
      }
    });
  };

  const loadAddresses = async () => {
    await withBusy("addresses", async () => {
      try {
        const data = await apiFetch<{ items: Address[] }>("/api/addresses");
        setAddresses(data.items);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load addresses.";
        setNotice({ type: "error", message });
      }
    });
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    await withBusy("register", async () => {
      try {
        await apiFetch<{ item: User }>("/api/users", {
          method: "POST",
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
          }),
        });
        setRegisterPassword("");
        setLoginEmail(registerEmail);
        setAuthMode("signin");
        setNotice({ type: "success", message: "Account created. Please log in." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create account.";
        setNotice({ type: "error", message });
      }
    });
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await withBusy("login", async () => {
      try {
        const data = await apiFetch<{ token: string }>("/api/users/tokens", {
          method: "POST",
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setLoginPassword("");
        setNotice({ type: "success", message: "Welcome back." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to login.";
        setNotice({ type: "error", message });
      }
    });
  };

  const handleCreateAddress = async (event: FormEvent) => {
    event.preventDefault();
    await withBusy("create", async () => {
      try {
        const data = await apiFetch<{ item: Address }>("/api/addresses", {
          method: "POST",
          body: JSON.stringify({
            name: placeName,
            description: placeDescription || null,
            searchWord: placeSearch,
          }),
        });
        setAddresses((current) => [data.item, ...current]);
        setPlaceName("");
        setPlaceDescription("");
        setPlaceSearch("");
        setNotice({ type: "success", message: "Place added." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to add place.";
        setNotice({ type: "error", message });
      }
    });
  };

  const handleNearbySearch = async (event: FormEvent) => {
    event.preventDefault();
    await withBusy("nearby", async () => {
      const radius = Number(radiusKm);
      const lat = Number(fromLat);
      const lng = Number(fromLng);

      if (Number.isNaN(radius) || radius <= 0) {
        setNotice({ type: "error", message: "Radius must be a positive number." });
        return;
      }
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        setNotice({ type: "error", message: "Latitude and longitude are required." });
        return;
      }

      try {
        const data = await apiFetch<{ items: Address[] }>("/api/addresses/searches", {
          method: "POST",
          body: JSON.stringify({
            radius,
            from: { lat, lng },
          }),
        });
        setNearby(data.items);
        setNotice({ type: "success", message: `${data.items.length} places found.` });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to search nearby places.";
        setNotice({ type: "error", message });
      }
    });
  };

  const applyOrigin = (
    coords: Coordinates,
    message = "Search origin updated.",
    type: Notice["type"] = "info",
  ) => {
    setFromLat(coords.lat.toFixed(6));
    setFromLng(coords.lng.toFixed(6));
    setNotice({ type, message });
    if (!selectedPlace) {
      setMapTarget(coords);
      setMapTitle("Search origin");
      setSearchPreviewLabel(null);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setNotice({ type: "error", message: "Geolocation is not supported in this browser." });
      return;
    }
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyOrigin(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          "Location captured.",
          "success",
        );
        setGeoBusy(false);
      },
      (error) => {
        setGeoBusy(false);
        setNotice({ type: "error", message: error.message || "Unable to read location." });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSelectPlace = async (address: Address) => {
    setSelectedPlace(address);
    setMapTarget({ lat: address.lat, lng: address.lng });
    setMapTitle(address.name);
    setSearchPreviewLabel(null);
    if (!addressLabels[address.id]) {
      const label = await reverseGeocode({ lat: address.lat, lng: address.lng });
      if (label) {
        setAddressLabels((current) => ({ ...current, [address.id]: label }));
      }
    }
  };

  const handlePreviewSearch = (coords: Coordinates, label: string) => {
    setSelectedPlace(null);
    setMapTarget(coords);
    setMapTitle("Search preview");
    setSearchPreviewLabel(label);
  };

  const handleShowOriginOnMap = () => {
    if (!origin) {
      setNotice({ type: "info", message: "Set an origin first." });
      return;
    }
    setSelectedPlace(null);
    setMapTarget(origin);
    setMapTitle("Search origin");
    setSearchPreviewLabel(null);
  };

  const selectedAddressLabel = selectedPlace
    ? addressLabels[selectedPlace.id] ?? selectedPlace.name
    : searchPreviewLabel;

  return (
    <div className="page">
      <TopBar isAuthed={isAuthed} me={me} onLogout={handleLogout} />
      <NoticeBanner notice={notice} />

      {!isAuthed ? (
        <AuthPage
          mode={authMode}
          setMode={setAuthMode}
          registerEmail={registerEmail}
          registerPassword={registerPassword}
          setRegisterEmail={setRegisterEmail}
          setRegisterPassword={setRegisterPassword}
          loginEmail={loginEmail}
          loginPassword={loginPassword}
          setLoginEmail={setLoginEmail}
          setLoginPassword={setLoginPassword}
          busyAction={busyAction}
          onRegister={handleRegister}
          onLogin={handleLogin}
        />
      ) : (
        <>
          <section className="grid two">
            <UserCard
              isAuthed={isAuthed}
              me={me}
              busyAction={busyAction}
              onRefreshProfile={loadMe}
              onRefreshAddresses={loadAddresses}
            />
            <MapPanel
              coordinates={mapTarget}
              title={mapTitle}
              addressLabel={selectedAddressLabel}
            />
          </section>
          <PlacesSection
            isAuthed={isAuthed}
            busyAction={busyAction}
            placeName={placeName}
            placeDescription={placeDescription}
            placeSearch={placeSearch}
            setPlaceName={setPlaceName}
            setPlaceDescription={setPlaceDescription}
            setPlaceSearch={setPlaceSearch}
            onCreateAddress={handleCreateAddress}
            addresses={addresses}
            origin={origin}
            onUseOrigin={applyOrigin}
            onSelectPlace={handleSelectPlace}
            onPreviewSearch={handlePreviewSearch}
            selectedPlaceId={selectedPlace?.id ?? null}
          />
          <NearbySection
            isAuthed={isAuthed}
            busyAction={busyAction}
            radiusKm={radiusKm}
            setRadiusKm={setRadiusKm}
            fromLat={fromLat}
            fromLng={fromLng}
            setFromLat={setFromLat}
            setFromLng={setFromLng}
            geoBusy={geoBusy}
            onUseLocation={handleUseLocation}
            onShowOrigin={handleShowOriginOnMap}
            onSearch={handleNearbySearch}
            nearby={nearby}
            origin={origin}
          />
        </>
      )}
    </div>
  );
}
