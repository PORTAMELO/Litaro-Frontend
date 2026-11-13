import { apiFetch } from "./Config";

export const getAllContentsForAdmin = () =>
  apiFetch("/webcontents/admin");

export const getAllContents = () =>
  apiFetch("/webcontents");

export const getContent = (pageName, sectionName, contentKey) =>
  apiFetch(`/webcontents/${pageName}/${sectionName}/${contentKey}`);

const pendingPages = new Map();

export const getPageContent = (pageName) => {
  const pending = pendingPages.get(pageName);
  if (pending) return pending;

  const request = apiFetch(`/webcontents/page/${encodeURIComponent(pageName)}`).finally(() => pendingPages.delete(pageName));
  pendingPages.set(pageName, request);
  return request;
};

export const selectSection = (rows, sectionName, contentKey) =>
  (rows ?? []).filter((row) => row.sectionName === sectionName && row.contentKey === contentKey);

export const createContent = (content) =>
  apiFetch("/webcontents", {
    method: "POST",
    body: JSON.stringify(content),
  });

export const updateContent = (id, content) =>
  apiFetch(`/webcontents/${id}`, {
    method: "PUT",
    body: JSON.stringify(content),
  });

export const deleteContent = (id) =>
  apiFetch(`/webcontents/${id}`, {
    method: "DELETE",
  });

export const activateContent = (id) =>
  apiFetch(`/webcontents/${id}/activate`, {
    method: "PATCH",
  });

export const deactivateContent = (id) =>
  apiFetch(`/webcontents/${id}/deactivate`, {
    method: "PATCH",
  });