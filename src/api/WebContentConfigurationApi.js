import { apiFetch } from "./config";

export const getAllConfigurations = () =>
    apiFetch("/webcontentconfigurations");