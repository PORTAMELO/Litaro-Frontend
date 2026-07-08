import * as api from "../../../api/WebContentApi";

export const getAll = () =>
  api.getAllContentsForAdmin();

export const create = (content) =>
  api.createContent(content);

export const update = (id, content) =>
  api.updateContent(id, content);

export const remove = (id) =>
  api.deleteContent(id);

export const activate = (id) =>
  api.activateContent(id);

export const deactivate = (id) =>
  api.deactivateContent(id);
