import { apiFetch } from "../../../../api/config";

export const getRecords = async (endpoint, filters) => {
    const query = buildQueryString(filters);
    const result = await apiFetch(`${endpoint}${query}`);

    return Array.isArray(result) ? { records: result, lookups: {} } : result;
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

export const getRoles = async () => {
    return await apiFetch("/roles");
};

export const createRole = async (name) => {
    return await apiFetch("/roles", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
};

export const getRolePermissions = async (roleId) => {
    return await apiFetch(`/role-permissions/${roleId}`);
};

export const saveRolePermission = async (payload) => {
    return await apiFetch("/role-permissions", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
};

export const getUserRoles = async (userId) => {
    return await apiFetch(`/users/${userId}/roles`);
};

export const setUserRoles = async (userId, roles) => {
    return await apiFetch(`/users/${userId}/roles`, {
        method: "PUT",
        body: JSON.stringify({ roles }),
    });
};

export const lookupUserByDocument = async (documentType, documentNumber) => {
    const params = new URLSearchParams({ documentType, documentNumber });
    return await apiFetch(`/users/lookup?${params.toString()}`);
};

export const setProfileEstado = async (endpoint, id, active) => {
    return await apiFetch(`${endpoint}/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ active }),
    });
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