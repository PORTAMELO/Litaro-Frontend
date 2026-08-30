import { apiFetch } from "../../../../api/config";

export const getRecords = async (endpoint) => {
    return await apiFetch(endpoint);
};

export const getSchema = async (tableName) => {
    return await apiFetch(`/schema/${tableName}`);
};
