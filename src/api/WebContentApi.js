import { apiFetch } from "./config";

export const getAllContentsForAdmin = () =>
  apiFetch("/webcontents/admin");

export const getAllContents = () =>
  apiFetch("/webcontents");

export const getContent = (pageName, sectionName, contentKey) =>
  apiFetch(`/webcontents/${pageName}/${sectionName}/${contentKey}`);

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