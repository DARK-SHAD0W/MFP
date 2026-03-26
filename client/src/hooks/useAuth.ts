import { useState } from "react";
import type { User } from "../types";

const TOKEN_KEY = "mfp_token";

type ApiFetchFn = <T,>(path: string, options?: RequestInit) => Promise<T>;

export function useAuth(apiFetch: ApiFetchFn) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [me, setMe] = useState<User | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const setToken = (newToken: string) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(newToken);
  };

  const loadMe = async (onError: (msg: string) => void) => {
    setBusyAction("me");
    try {
      const data = await apiFetch<{ item: User }>("/api/users/me");
      setMe(data.item);
    } catch (error) {
      setMe(null);
      const message = error instanceof Error ? error.message : "Unable to fetch user.";
      if (message === "access denied") {
        logout(onError);
      } else {
        onError(message);
      }
    } finally {
      setBusyAction(null);
    }
  };

  const register = async (
    email: string,
    password: string,
    onSuccess: () => void,
    onError: (msg: string) => void,
  ) => {
    setBusyAction("register");
    try {
      await apiFetch<{ item: User }>("/api/users", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      onError(message);
    } finally {
      setBusyAction(null);
    }
  };

  const login = async (
    email: string,
    password: string,
    onSuccess: () => void,
    onError: (msg: string) => void,
  ) => {
    setBusyAction("login");
    try {
      const data = await apiFetch<{ token: string }>("/api/users/tokens", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login.";
      onError(message);
    } finally {
      setBusyAction(null);
    }
  };

  const logout = (onLogout?: (msg: string) => void) => {
    setToken("");
    setMe(null);
    if (onLogout) {
      onLogout("Logged out.");
    }
  };

  return {
    token,
    me,
    busyAction,
    loadMe,
    register,
    login,
    logout,
  };
}
