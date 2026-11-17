import { apiFetch } from "@/api/Config";
import { toQuery } from "@/api/Query";

const BASE = "/attendance-register";

const send = (method, url, body) =>
  apiFetch(url, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const getOptions = () => apiFetch(`${BASE}/options`);

export const getAgenda = (date, classroomId) => apiFetch(`${BASE}/agenda${toQuery({ date, classroomId })}`);

export const getSheet = (classroomId, date, startTime) =>
  apiFetch(`${BASE}/sheet${toQuery({ classroomId, date, startTime })}`);

export const saveSheet = (body) => send("PUT", `${BASE}/sheet`, body);

export const getLateArrivals = (date) => apiFetch(`${BASE}/late-arrivals${toQuery({ date })}`);

export const registerLateArrival = (enrollmentId) => send("POST", `${BASE}/late-arrivals`, { enrollmentId });

export const deleteLateArrival = (id) => send("DELETE", `${BASE}/late-arrivals/${id}`);

export const searchStudents = (text) => apiFetch(`${BASE}/students/search${toQuery({ q: text })}`);

export const getExcuses = (yearId) => apiFetch(`${BASE}/excuses${toQuery({ yearId })}`);

export const previewExcuse = (body) => send("POST", `${BASE}/excuses/preview`, body);

export const createExcuse = (body) => send("POST", `${BASE}/excuses`, body);

export const deleteExcuse = (id) => send("DELETE", `${BASE}/excuses/${id}`);

export const getSummary = (periodId, classroomId, subjectId) =>
  apiFetch(`${BASE}/summary${toQuery({ periodId, classroomId, subjectId })}`);

export const getSettings = () => apiFetch(`${BASE}/settings`);

export const saveSettings = (body) => send("PUT", `${BASE}/settings`, body);
