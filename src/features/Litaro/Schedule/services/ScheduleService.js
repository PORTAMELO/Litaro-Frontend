import { apiFetch } from "../../../../api/Config";

const toQuery = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : "";
};

const recordsOf = (result) => (Array.isArray(result) ? result : (result?.records ?? []));

export const getLookupOptions = async (tableName) => {
  const options = await apiFetch(`/lookup-options/${tableName}`);
  return (options ?? []).map((option) => ({ id: Number(option.id), label: option.label }));
};

export const getClassrooms = async () => recordsOf(await apiFetch("/classrooms"));

export const getAssignments = async (yearId) => {
  try {
    return recordsOf(await apiFetch(`/academic-assignments${toQuery({ yearId })}`));
  } catch {
    return [];
  }
};

export const createAssignment = async (payload) =>
  apiFetch("/academic-assignments", { method: "POST", body: JSON.stringify(payload) });

export const changeAssignmentTeacher = async (id, teacherId) =>
  apiFetch(`/academic-assignments/${id}/teacher`, { method: "PATCH", body: JSON.stringify({ teacherId }) });

export const getScheduleView = async (filters) => apiFetch(`/schedules/view${toQuery(filters)}`);

export const getProgress = async (classroomId, yearId) =>
  apiFetch(`/schedules/progress${toQuery({ classroomId, yearId })}`);

export const getParentAttention = async (yearId, campusId) =>
  apiFetch(`/schedules/parent-attention${toQuery({ yearId, campusId })}`);

export const getMySchedule = async (yearId) => apiFetch(`/me/schedule${toQuery({ yearId })}`);

export const saveBlock = async (id, payload) =>
  apiFetch(id ? `/schedules/${id}` : "/schedules", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });

export const deleteBlock = async (id) => apiFetch(`/schedules/${id}`, { method: "DELETE" });

export const getSpaces = async (params) => recordsOf(await apiFetch(`/spaces${toQuery(params)}`));

export const saveSpace = async (id, payload) =>
  apiFetch(id ? `/spaces/${id}` : "/spaces", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });

export const deactivateSpace = async (id) =>
  apiFetch(`/spaces/${id}/estado`, { method: "PUT", body: JSON.stringify({ active: false }) });

export const getStudyPlans = async (yearId) => recordsOf(await apiFetch(`/study-plans${toQuery({ yearId })}`));

export const saveStudyPlan = async (id, payload) =>
  apiFetch(id ? `/study-plans/${id}` : "/study-plans", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });

export const deleteStudyPlan = async (id) => apiFetch(`/study-plans/${id}`, { method: "DELETE" });

export const getAvailabilities = async (yearId) =>
  recordsOf(await apiFetch(`/teacher-availabilities${toQuery({ yearId })}`));

export const saveAvailability = async (id, payload) =>
  apiFetch(id ? `/teacher-availabilities/${id}` : "/teacher-availabilities", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });

export const deleteAvailability = async (id) => apiFetch(`/teacher-availabilities/${id}`, { method: "DELETE" });

export const saveClassroomSettings = async (id, payload) =>
  apiFetch(`/classrooms/${id}/schedule-settings`, { method: "PATCH", body: JSON.stringify(payload) });
