import { apiFetch } from "../../../../api/Config";

const BASE = "/enrollment-process";

const post = (url, body) =>
  apiFetch(url, { method: "POST", ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const getOptions = () => apiFetch(`${BASE}/options`);

export const getPeriod = (yearId) => apiFetch(`${BASE}/periods/${yearId}`);

export const savePeriod = (yearId, period) =>
  apiFetch(`${BASE}/periods/${yearId}`, { method: "PUT", body: JSON.stringify(period) });

export const getPreEnrollments = (yearId) => apiFetch(`${BASE}/pre-enrollments?yearId=${yearId}`);

export const generatePreEnrollments = (yearId) => post(`${BASE}/pre-enrollments/generate?yearId=${yearId}`);

export const respondPreEnrollment = (id, confirm, note) =>
  post(`${BASE}/pre-enrollments/${id}/respond`, { confirm, note });

export const getAdmissions = (yearId) => apiFetch(`${BASE}/admissions?yearId=${yearId}`);

export const createAdmission = (admission) => post(`${BASE}/admissions`, admission);

export const getAdmissionEvents = (id) => apiFetch(`${BASE}/admissions/${id}/events`);

export const decideAdmission = (id, decision, note) => post(`${BASE}/admissions/${id}/decision`, { decision, note });

