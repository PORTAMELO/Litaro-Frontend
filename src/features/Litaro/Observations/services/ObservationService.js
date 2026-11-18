import { apiFetch } from "@/api/Config";
import { toQuery } from "@/api/Query";
import { CLIENT_HEADERS } from "@/shared/utils/Files";

const OBSERVATIONS = "/observations";
const CITATIONS = "/citations";

const send = (method, url, body) =>
  apiFetch(url, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

// Observaciones (HU26)
export const getOptions = () => apiFetch(`${OBSERVATIONS}/options`);

export const getStudents = (classroomId, q) => apiFetch(`${OBSERVATIONS}/students${toQuery({ classroomId, q })}`);

export const getObservations = (filter) => apiFetch(`${OBSERVATIONS}${toQuery(filter)}`);

export const getObservation = (id) => apiFetch(`${OBSERVATIONS}/${id}`);

export const createObservation = (body) => send("POST", OBSERVATIONS, body);

export const updateObservation = (id, body) => send("PUT", `${OBSERVATIONS}/${id}`, body);

export const saveStatement = (id, statement) => send("PUT", `${OBSERVATIONS}/${id}/statement`, { statement });

export const uploadStatementFile = (id, file) => {
  const body = new FormData();
  body.append("file", file);

  return apiFetch(`${OBSERVATIONS}/${id}/statement-file`, { method: "POST", body, headers: CLIENT_HEADERS });
};

export const openStatementFile = (id) => apiFetch(`${OBSERVATIONS}/${id}/statement-file`, { raw: true });

export const removeStatementFile = (id) => send("DELETE", `${OBSERVATIONS}/${id}/statement-file`);

export const addCommitment = (id, body) => send("POST", `${OBSERVATIONS}/${id}/commitments`, body);

export const setCommitmentStatus = (commitmentId, body) =>
  send("PUT", `${OBSERVATIONS}/commitments/${commitmentId}/status`, body);

// Consolidado (HU27)
export const getRanking = (filter) => apiFetch(`${OBSERVATIONS}/ranking${toQuery(filter)}`);

export const getConsolidated = (studentId, yearId) =>
  apiFetch(`${OBSERVATIONS}/students/${studentId}/consolidated${toQuery({ yearId })}`);

export const getSettings = () => apiFetch(`${OBSERVATIONS}/settings`);

export const saveSettings = (body) => send("PUT", `${OBSERVATIONS}/settings`, body);

// Citaciones (HU28)
export const getCitations = (filter) => apiFetch(`${CITATIONS}${toQuery(filter)}`);

export const getCitationStudents = (classroomId, q) => apiFetch(`${CITATIONS}/students${toQuery({ classroomId, q })}`);

export const getParents = (studentId) => apiFetch(`${CITATIONS}/parents${toQuery({ studentId })}`);

export const getSlots = (userId) => apiFetch(`${CITATIONS}/slots${toQuery({ userId })}`);

export const createCitation = (body) => send("POST", CITATIONS, body);

export const scheduleCitation = (id, body) => send("PUT", `${CITATIONS}/${id}/schedule`, body);

export const rescheduleCitation = (id, body) => send("POST", `${CITATIONS}/${id}/reschedule`, body);

export const setCitationFlags = (id, body) => send("PUT", `${CITATIONS}/${id}/flags`, body);

export const setCitationStatus = (id, body) => send("PUT", `${CITATIONS}/${id}/status`, body);
