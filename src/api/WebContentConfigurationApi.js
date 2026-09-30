import { apiFetch } from "./Config";

export const getAllConfigurations = () =>
    apiFetch("/webcontentconfigurations");