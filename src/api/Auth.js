import { apiFetch } from "./Config";

export const loginRequest = (email, password) =>
  apiFetch(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
    true,
  );

export const logoutRequest = () =>
  apiFetch("/auth/logout", {
    method: "POST",
  });

export const sessionRequest = () =>
  apiFetch("/auth/session", {}, true);

export const activateRequest = (login, birthDate, newPassword) =>
  apiFetch(
    "/auth/activate",
    {
      method: "POST",
      body: JSON.stringify({ login, birthDate, newPassword }),
    },
    true,
  );

export const changePasswordRequest = (login, currentPassword, newPassword) =>
  apiFetch(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify({ login, currentPassword, newPassword }),
    },
    true,
  );