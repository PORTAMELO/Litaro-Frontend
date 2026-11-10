import { apiFetch } from "../../../../api/Config";

const post = (url, body) =>
  apiFetch(url, { method: "POST", ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const getNotifications = ({ state, typeId } = {}) => {
  const params = new URLSearchParams();

  if (state) params.set("state", state);
  if (typeId) params.set("typeId", typeId);

  const query = params.toString();

  return apiFetch(`/notifications${query ? `?${query}` : ""}`);
};

export const getSummary = () => apiFetch("/notifications/summary");

export const markRead = (id) => post(`/notifications/${id}/read`);

export const markDone = (ids, note) => post("/notifications/done", { ids, note });

export const getTypes = () => apiFetch("/notification-types");

export const searchUsers = (query) => apiFetch(`/notification-types/users?q=${encodeURIComponent(query)}`);

export const saveType = (id, body) => apiFetch(`/notification-types/${id}`, { method: "PUT", body: JSON.stringify(body) });
