import { apiFetch } from "./Config";

export const permissionsRequest = (role) =>
  apiFetch(`/permissions/me${role ? `?role=${encodeURIComponent(role)}` : ""}`);
