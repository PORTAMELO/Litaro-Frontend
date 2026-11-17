import { apiFetch } from "../../../../api/Config";
import { CLIENT_HEADERS } from "../../../../shared/utils/Files";

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


export const restoreLostPreEnrollments = (yearId) => post(`${BASE}/pre-enrollments/restore?yearId=${yearId}`);

const put = (url, body) => apiFetch(url, { method: "PUT", body: JSON.stringify(body) });

const remove = (url) => apiFetch(url, { method: "DELETE" });

const upload = (url, file) => {
  const body = new FormData();
  body.append("file", file);

  return apiFetch(url, { method: "POST", body, headers: CLIENT_HEADERS });
};

const download = (url) => apiFetch(url, { raw: true });

const admissionDocument = (id, detailId) => `${BASE}/admissions/${id}/documents/${detailId}`;

const studentDocument = (studentId, detailId) => `${BASE}/students/${studentId}/documents/${detailId}`;

export const getFormOptions = () => apiFetch(`${BASE}/form-options`);

export const lookupPerson = (documentNumber) =>
  apiFetch(`${BASE}/people/${encodeURIComponent(documentNumber)}`);

export const getAdmission = (id) => apiFetch(`${BASE}/admissions/${id}`);

export const updateAdmission = (id, body) => put(`${BASE}/admissions/${id}`, body);

export const uploadAdmissionDocument = (id, detailId, file) => upload(admissionDocument(id, detailId), file);

export const deleteAdmissionDocument = (id, detailId) => remove(admissionDocument(id, detailId));

export const downloadAdmissionDocument = (id, detailId) => download(`${admissionDocument(id, detailId)}/file`);

export const getStudentForm = (studentId, yearId) =>
  apiFetch(`${BASE}/students/${studentId}/form?yearId=${yearId}`);

export const saveStudentForm = (studentId, body) => put(`${BASE}/students/${studentId}/form`, body);

export const uploadStudentDocument = (studentId, yearId, detailId, file) =>
  upload(`${studentDocument(studentId, detailId)}?yearId=${yearId}`, file);

export const deleteStudentDocument = (studentId, yearId, detailId) =>
  remove(`${studentDocument(studentId, detailId)}?yearId=${yearId}`);

export const downloadStudentDocument = (studentId, yearId, detailId) =>
  download(`${studentDocument(studentId, detailId)}/file?yearId=${yearId}`);

export const getDocumentSettings = () => apiFetch(`${BASE}/settings/documents`);

export const saveDocumentSettings = (items) => put(`${BASE}/settings/documents`, items);
