import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Address, Coordinates } from "./types";
import { useApiFetch, useAuth, useAddresses, useNearbySearch, useGeolocation, useNotice } from "./hooks";
import { reverseGeocode } from "./utils/geo";
import AuthPage from "./components/AuthPage";
import MapPanel from "./components/MapPanel";
import NearbySection from "./components/NearbySection";
import NoticeBanner from "./components/NoticeBanner";
import PlacesSection from "./components/PlacesSection";
import TopBar from "./components/TopBar";
import UserCard from "./components/UserCard";

const TOKEN_KEY = "mfp_token";

function toNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function App() {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const setToken = (newToken: string) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(newToken);
  };
  const { notice, showNotice } = useNotice();
  const apiFetch = useApiFetch(token);
  const { me, busyAction: authBusy, loadMe, register, login, logout } = useAuth(apiFetch, token, setToken);
  const { addresses, busyAction: addressesBusy, load: loadAddresses, create: createAddress } = useAddresses(apiFetch);
  const { nearby, busyAction: nearbySusy, search: searchNearby } = useNearbySearch(apiFetch);
  const { geoBusy, requestLocation } = useGeolocation();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
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
  const [selectedPlace, setSelectedPlace] = useState<Address | null>(null);
  const [addressLabels, setAddressLabels] = useState<Record<number, string>>({});
  const [mapTarget, setMapTarget] = useState<Coordinates | null>(null);
  const [mapTitle, setMapTitle] = useState("Map preview");
  const [searchPreviewLabel, setSearchPreviewLabel] = useState<string | null>(null);

  const isAuthed = Boolean(token);
  const busyAction = authBusy || addressesBusy || nearbySusy;
  const origin = useMemo<Coordinates | null>(() => {
    const lat = toNumber(fromLat);
    const lng = toNumber(fromLng);
    if (lat === null || lng === null) return null;
    return { lat, lng };
  }, [fromLat, fromLng]);

  // Reload profile and addresses when token changes
  useEffect(() => {
    if (token) {
      loadMe((msg) => showNotice("error", msg));
      loadAddresses((msg) => showNotice("error", msg));
    } else {
      setSelectedPlace(null);
      setMapTarget(null);
      setMapTitle("Map preview");
      setSearchPreviewLabel(null);
    }
  }, [token]);

  // Set favicon
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
      // ignore
    }
  }, []);

  const handleLogout = () => {
    logout((msg) => showNotice("info", msg));
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    await new Promise<void>((resolve) => {
      register(
        registerEmail,
        registerPassword,
        () => {
          setRegisterPassword("");
          setLoginEmail(registerEmail);
          setAuthMode("signin");
          showNotice("success", "Account created. Please log in.");
          resolve();
        },
        (msg) => {
          showNotice("error", msg);
          resolve();
        },
      );
    });
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await new Promise<void>((resolve) => {
      login(
        loginEmail,
        loginPassword,
        () => {
          setLoginPassword("");
          showNotice("success", "Welcome back.");
          resolve();
        },
        (msg) => {
          showNotice("error", msg);
          resolve();
        },
      );
    });
  };

  const handleCreateAddress = async (event: FormEvent) => {
    event.preventDefault();
    await new Promise<void>((resolve) => {
      createAddress(
        placeName,
        placeDescription || null,
        placeSearch,
        () => {
          setPlaceName("");
          setPlaceDescription("");
          setPlaceSearch("");
          showNotice("success", "Place added.");
          resolve();
        },
        (msg) => {
          showNotice("error", msg);
          resolve();
        },
      );
    });
  };

  const handleNearbySearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!origin) {
      showNotice("error", "Set an origin first (latitude and longitude required).");
      return;
    }

    await new Promise<void>((resolve) => {
      searchNearby(
        origin,
        Number(radiusKm),
        (count) => {
          showNotice("success", `${count} places found.`);
          resolve();
        },
        (msg) => {
          showNotice("error", msg);
          resolve();
        },
      );
    });
  };

  const applyOrigin = (
    coords: Coordinates,
    message = "Search origin updated.",
    type: "info" | "success" = "info",
  ) => {
    setFromLat(coords.lat.toFixed(6));
    setFromLng(coords.lng.toFixed(6));
    showNotice(type, message);
    if (!selectedPlace) {
      setMapTarget(coords);
      setMapTitle("Search origin");
      setSearchPreviewLabel(null);
    }
  };

  const handleUseLocation = () => {
    requestLocation(
      (coords) => applyOrigin(coords, "Location captured.", "success"),
      (msg) => showNotice("error", msg),
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
      showNotice("info", "Set an origin first.");
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
              onRefreshProfile={() => loadMe((msg) => showNotice("error", msg))}
              onRefreshAddresses={() => loadAddresses((msg) => showNotice("error", msg))}
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
