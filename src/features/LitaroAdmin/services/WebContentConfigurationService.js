import * as api from "../../../api/WebContentConfigurationApi";

export const getConfiguration = (
    page,
    section,
    contentKey
) =>
    api.getConfiguration(
        page,
        section,
        contentKey
    );

export const getAll = () =>
    api.getAllConfigurations();