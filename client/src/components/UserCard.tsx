import type { User } from "../types";

type UserCardProps = {
  isAuthed: boolean;
  me: User | null;
  busyAction: string | null;
  onRefreshProfile: () => void | Promise<void>;
  onRefreshAddresses: () => void | Promise<void>;
};

export default function UserCard({
  isAuthed,
  me,
  busyAction,
  onRefreshProfile,
  onRefreshAddresses,
}: UserCardProps) {
  return (
    <div className="card">
      <div className="card-title">
        <h2>Current user</h2>
        <span className="meta">Profile</span>
      </div>
      {me ? (
        <div className="stack">
          <div className="title">{me.email}</div>
          <div className="meta">User ID: {me.id}</div>
          <div className="meta">Joined: {new Date(me.createdAt).toLocaleString()}</div>
        </div>
      ) : (
        <p className="meta">Log in to see your profile.</p>
      )}
      <div className="actions">
        <button
          className="btn secondary"
          onClick={() => void onRefreshProfile()}
          disabled={!isAuthed || busyAction === "me"}
        >
          Refresh profile
        </button>
        <button
          className="btn"
          onClick={() => void onRefreshAddresses()}
          disabled={!isAuthed || busyAction === "addresses"}
        >
          Refresh addresses
        </button>
      </div>
    </div>
  );
}
