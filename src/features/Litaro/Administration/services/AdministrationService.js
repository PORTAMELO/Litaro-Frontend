import { apiFetch } from "../../../../api/config";

export const getRecords = async (endpoint, filters) => {
    const query = buildQueryString(filters);
    return await apiFetch(`${endpoint}${query}`);
};

export const getSchema = async (tableName) => {
    return await apiFetch(`/schema/${tableName}`);
};

export const getColumnConfiguration = async (tableName) => {
    return await apiFetch(`/column-configuration/${tableName}`);
};

export const updateColumnConfiguration = async (tableName, columns) => {
    return await apiFetch(`/column-configuration/${tableName}`, {
        method: "PUT",
        body: JSON.stringify({ columns }),
    });
};

export const createRecord = async (endpoint, data) => {
    return await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const getCharacteristics = async () => {
    const result = await getRecords("/characteristics");
    return result.records ?? [];
};

export const getCharacteristicDetails = async (characteristicId) => {
    return await apiFetch(`/characteristics/${characteristicId}/details`);
};

export const getLookupOptions = async (tableName) => {
    return await apiFetch(`/lookup-options/${tableName}`);
};

function buildQueryString(filters) {
    if (!filters) return "";

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            params.append(key, value);
        }
    });

    const qs = params.toString();
    return qs ? `?${qs}` : "";
}
