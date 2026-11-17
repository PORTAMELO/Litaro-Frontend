import { apiFetch } from "../../../../api/Config";

const BASE = "/year-closing";

const send = (method, url, body) => apiFetch(url, { method, body: JSON.stringify(body) });

export const getOptions = (yearId) => apiFetch(`${BASE}/options${yearId ? `?yearId=${yearId}` : ""}`);

export const getPreview = (yearId, classroomId) =>
  apiFetch(`${BASE}/preview?yearId=${yearId}&classroomId=${classroomId}`);

export const close = (yearId, classroomId, decisions) => send("POST", `${BASE}/close`, { yearId, classroomId, decisions });

export const getSettings = () => apiFetch(`${BASE}/settings`);

export const saveSettings = (settings) => send("PUT", `${BASE}/settings`, settings);
