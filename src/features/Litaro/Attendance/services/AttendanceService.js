import { apiFetch } from "../../../../api/Config";

const BASE = "/attendance-register";

const query = (params) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") search.set(key, value);
  });

  const text = search.toString();

  return text ? `?${text}` : "";
};

const send = (method, url, body) =>
  apiFetch(url, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const getOptions = () => apiFetch(`${BASE}/options`);

export const getAgenda = (date, classroomId) => apiFetch(`${BASE}/agenda${query({ date, classroomId })}`);

export const getSheet = (classroomId, date, startTime) =>
  apiFetch(`${BASE}/sheet${query({ classroomId, date, startTime })}`);

export const saveSheet = (body) => send("PUT", `${BASE}/sheet`, body);

export const getLateArrivals = (date) => apiFetch(`${BASE}/late-arrivals${query({ date })}`);

export const registerLateArrival = (enrollmentId) => send("POST", `${BASE}/late-arrivals`, { enrollmentId });

export const deleteLateArrival = (id) => send("DELETE", `${BASE}/late-arrivals/${id}`);

export const searchStudents = (text) => apiFetch(`${BASE}/students/search${query({ q: text })}`);

export const getExcuses = (yearId) => apiFetch(`${BASE}/excuses${query({ yearId })}`);

export const previewExcuse = (body) => send("POST", `${BASE}/excuses/preview`, body);

export const createExcuse = (body) => send("POST", `${BASE}/excuses`, body);

export const deleteExcuse = (id) => send("DELETE", `${BASE}/excuses/${id}`);

export const getSummary = (periodId, classroomId, subjectId) =>
  apiFetch(`${BASE}/summary${query({ periodId, classroomId, subjectId })}`);

export const getSettings = () => apiFetch(`${BASE}/settings`);

export const saveSettings = (body) => send("PUT", `${BASE}/settings`, body);
