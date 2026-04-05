import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

const accessTokenFromStorage = browser
  ? localStorage.getItem("accessToken")
  : null;

const refreshTokenFromStorage = browser
  ? localStorage.getItem("refreshToken")
  : null;

export const auth = writable({
  user: null,
  accessToken: accessTokenFromStorage,
  refreshToken: refreshTokenFromStorage,
  isLoading: true,
  isAuthenticated: false
});

const apiBase = "http://localhost:3000";

export function setAccessToken(token: string | null) {
  if (browser) {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  auth.update((state) => ({
    ...state,
    accessToken: token
  }));
}

export function setRefreshToken(token: string | null) {
  if (browser) {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }

  auth.update((state) => ({
    ...state,
    refreshToken: token
  }));
}

export function clearAuth() {
  if (browser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  auth.set({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    isAuthenticated: false
  });
}

export async function fetchMe(token: string) {
  const res = await fetch(`${apiBase}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("auth/me failed");
  }

  return await res.json();
}

export async function refreshAccessToken() {
  const currentRefreshToken = browser
    ? localStorage.getItem("refreshToken")
    : null;

  if (!currentRefreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch(`${apiBase}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken: currentRefreshToken })
  });

  if (!res.ok) {
    throw new Error("Refresh token failed");
  }

  const data = await res.json();

  if (!data.accessToken) {
    throw new Error("No access token returned");
  }

  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function initializeAuth() {
  auth.update((state) => ({
    ...state,
    isLoading: true
  }));

  let token = get(auth).accessToken;

  try {
    if (!token) {
      throw new Error("No access token");
    }

    const user = await fetchMe(token);

    auth.update((state) => ({
      ...state,
      user,
      isAuthenticated: true,
      isLoading: false
    }));

    return true;
  } catch {
    try {
      token = await refreshAccessToken();
      const user = await fetchMe(token);

      auth.update((state) => ({
        ...state,
        user,
        isAuthenticated: true,
        isLoading: false
      }));

      return true;
    } catch {
      clearAuth();
      return false;
    }
  }
}

export async function logout() {
  const refreshToken = get(auth).refreshToken;

  if (!refreshToken) {
    clearAuth();
    return;
  }

  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    clearAuth();
    location.reload();
  }
}