import { apiFetch } from "../../../../api/Config";

const post = (url, body) =>
  apiFetch(url, { method: "POST", ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const PAGE_SIZE = 50;

export const getNotifications = ({ state, typeId, page = 1, pageSize = PAGE_SIZE } = {}) => {
  const params = new URLSearchParams();

  if (state) params.set("state", state);
  if (typeId) params.set("typeId", typeId);
  params.set("page", page);
  params.set("pageSize", pageSize);

  return apiFetch(`/notifications?${params.toString()}`);
};

export const getSummary = () => apiFetch("/notifications/summary");

export const markRead = (id) => post(`/notifications/${id}/read`);

export const markReadMany = (ids) => post("/notifications/read", { ids });

export const markReadMatching = (matching) => post("/notifications/read", { matching });

export const markDone = (ids, note) => post("/notifications/done", { ids, note });

export const markDoneMatching = (matching, note) => post("/notifications/done", { matching, note });

export const getTypes = () => apiFetch("/notification-types");

export const searchUsers = (query) => apiFetch(`/notification-types/users?q=${encodeURIComponent(query)}`);

export const saveType = (id, body) => apiFetch(`/notification-types/${id}`, { method: "PUT", body: JSON.stringify(body) });
