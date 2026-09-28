import { apiFetch } from "./Config";

export const permissionsRequest = () => apiFetch("/permissions/me");