import { apiFetch } from "../../../../api/Config";

const BASE = "/student-movements";

const post = (url, body) => apiFetch(url, { method: "POST", body: JSON.stringify(body) });

export const getOptions = () => apiFetch(`${BASE}/options`);

export const searchStudents = (query) => apiFetch(`${BASE}/students?q=${encodeURIComponent(query)}`);

export const getEvents = (enrollmentId) => apiFetch(`${BASE}/students/${enrollmentId}/events`);

export const getCertificate = (eventId) => apiFetch(`${BASE}/events/${eventId}/certificate`);

export const changeClassroom = (enrollmentId, toClassroomId, note) =>
  post(`${BASE}/classroom`, { enrollmentId, toClassroomId, note });

export const transferCampus = (enrollmentId, toClassroomId, note) =>
  post(`${BASE}/campus`, { enrollmentId, toClassroomId, note });

export const withdraw = (enrollmentId, reason, note) => post(`${BASE}/withdrawal`, { enrollmentId, reason, note });
