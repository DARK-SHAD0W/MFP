import type { User } from "../types";

type TopBarProps = {
  isAuthed: boolean;
  me: User | null;
  onLogout: () => void;
};

export default function TopBar({ isAuthed, me, onLogout }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <div className="brand">My Favorite Places</div>
        <div className="meta">
          {isAuthed ? `Signed in as ${me?.email ?? "user"}` : "Plan and save your places"}
        </div>
      </div>
      <div className="topbar-right">
        <div className={`pill ${isAuthed ? "ok" : "warn"}`}>
          {isAuthed ? "Authenticated" : "Not logged in"}
        </div>
        {isAuthed && (
          <button className="btn ghost" onClick={onLogout}>
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
