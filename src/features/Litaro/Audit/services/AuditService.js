import { apiFetch } from "../../../../api/Config";

export const PAGE_SIZE = 50;

export const getEvents = ({ category, from, to, userId, eventType, tableName, recordId, page = 1, pageSize = PAGE_SIZE }) => {
  const params = new URLSearchParams();

  params.set("category", category);

  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (userId) params.set("userId", userId);
  if (eventType) params.set("eventType", eventType);
  if (tableName) params.set("tableName", tableName);
  if (recordId) params.set("recordId", recordId);

  params.set("page", page);
  params.set("pageSize", pageSize);

  return apiFetch(`/audit/events?${params.toString()}`);
};

export const getEvent = (id) => apiFetch(`/audit/events/${id}`);

export const getOptions = () => apiFetch("/audit/options");

export const searchUsers = (query) => apiFetch(`/audit/users?q=${encodeURIComponent(query)}`);
