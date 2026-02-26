import type { Dispatch, FormEvent, SetStateAction } from "react";

type AuthMode = "signin" | "signup";

type AuthPageProps = {
  mode: AuthMode;
  setMode: Dispatch<SetStateAction<AuthMode>>;
  registerEmail: string;
  registerPassword: string;
  setRegisterEmail: Dispatch<SetStateAction<string>>;
  setRegisterPassword: Dispatch<SetStateAction<string>>;
  loginEmail: string;
  loginPassword: string;
  setLoginEmail: Dispatch<SetStateAction<string>>;
  setLoginPassword: Dispatch<SetStateAction<string>>;
  busyAction: string | null;
  onRegister: (event: FormEvent) => void | Promise<void>;
  onLogin: (event: FormEvent) => void | Promise<void>;
};

export default function AuthPage({
  mode,
  setMode,
  registerEmail,
  registerPassword,
  setRegisterEmail,
  setRegisterPassword,
  loginEmail,
  loginPassword,
  setLoginEmail,
  setLoginPassword,
  busyAction,
  onRegister,
  onLogin,
}: AuthPageProps) {
  const isSignIn = mode === "signin";

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Welcome</p>
        <h1>Save real places and find what is close to you.</h1>
        <p className="sub">
          Create an account to store addresses, then search what is nearby using your
          current location or a chosen point.
        </p>
        <div className="segmented" role="tablist" aria-label="Choose sign in or sign up">
          <button
            type="button"
            className={isSignIn ? "active" : ""}
            onClick={() => setMode("signin")}
            aria-pressed={isSignIn}
          >
            Sign in
          </button>
          <button
            type="button"
            className={!isSignIn ? "active" : ""}
            onClick={() => setMode("signup")}
            aria-pressed={!isSignIn}
          >
            Sign up
          </button>
        </div>
      </div>

      <div className="card">
        <h2>{isSignIn ? "Sign in" : "Create account"}</h2>
        {isSignIn ? (
          <form onSubmit={onLogin}>
            <label>
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Your password"
                required
              />
            </label>
            <button className="btn" type="submit" disabled={busyAction === "login"}>
              Sign in
            </button>
            <button type="button" className="link" onClick={() => setMode("signup")}>
              Need an account? Sign up
            </button>
          </form>
        ) : (
          <form onSubmit={onRegister}>
            <label>
              Email
              <input
                type="email"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                placeholder="Create a password"
                required
              />
            </label>
            <button className="btn" type="submit" disabled={busyAction === "register"}>
              Create account
            </button>
            <button type="button" className="link" onClick={() => setMode("signin")}>
              Already have an account? Sign in
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
