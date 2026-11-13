import { apiFetch } from "../../../../api/Config";

const BASE = "/grading";

const query = (params) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") search.set(key, value);
  });

  const text = search.toString();

  return text ? `?${text}` : "";
};

const CLIENT_HEADERS = { "X-Requested-With": "XMLHttpRequest" };

const send = (method, url, body) =>
  apiFetch(url, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });

export const getOptions = () => apiFetch(`${BASE}/options`);

export const getSheet = (classroomId, subjectId, periodId) =>
  apiFetch(`${BASE}/sheet${query({ classroomId, subjectId, periodId })}`);

export const setMode = (body) => send("PUT", `${BASE}/sheet/mode`, body);

export const createActivity = (body) => send("POST", `${BASE}/activities`, body);

export const updateActivity = (id, body) => send("PUT", `${BASE}/activities/${id}`, body);

export const deleteActivity = (id) => send("DELETE", `${BASE}/activities/${id}`);

export const saveScores = (body) => send("PUT", `${BASE}/scores`, body);

export const getPlanners = () => apiFetch(`${BASE}/planners`);

export const getPanel = () => apiFetch(`${BASE}/planners/panel`);

export const uploadPlanner = (assignmentId, file) => {
  const body = new FormData();
  body.append("file", file);

  return apiFetch(`${BASE}/planners/${assignmentId}`, { method: "POST", body, headers: CLIENT_HEADERS });
};

export const deletePlanner = (assignmentId) => send("DELETE", `${BASE}/planners/${assignmentId}`);

export const downloadPlanner = (assignmentId) => apiFetch(`${BASE}/planners/${assignmentId}/file`, { raw: true });

export const requestPlanner = (assignmentId) =>
  apiFetch(`${BASE}/planners/${assignmentId}/request`, { method: "POST", headers: CLIENT_HEADERS });

export const getDeadlines = (yearId) => apiFetch(`${BASE}/deadlines${query({ yearId })}`);

export const saveDeadlines = (body) => send("PUT", `${BASE}/deadlines`, body);
