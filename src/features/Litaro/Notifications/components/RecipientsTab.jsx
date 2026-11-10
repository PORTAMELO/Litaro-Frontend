import { useState } from "react";
import { Autocomplete, Button, FormControlLabel, Switch, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import { EmptyState, Field } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import * as service from "../services/NotificationService";
import { TEMPLATE_LIMIT } from "../utils/NotificationUtils";

const RecipientsTab = ({ canEdit, notify }) => {
  const { data, error, loading, reload } = useLoad(() => service.getTypes(), []);

  const [draft, setDraft] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  const types = data?.types ?? [];
  const roles = data?.roles ?? [];

  const edit = (type) => {
    setUserOptions([]);
    setDraft({
      id: type.notificationTypeId,
      name: type.name,
      template: type.template,
      active: type.active,
      roles: type.roles,
      users: type.users,
    });
  };

  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const findUsers = (text) => {
    if (text.trim().length < 2) {
      setUserOptions([]);
      return;
    }

    service
      .searchUsers(text.trim())
      .then((found) => setUserOptions(found ?? []))
      .catch(() => setUserOptions([]));
  };

  const save = async () => {
    setSaving(true);

    try {
      await service.saveType(draft.id, {
        template: draft.template,
        active: draft.active,
        roleIds: draft.roles.map((role) => role.roleId),
        userIds: draft.users.map((user) => user.userId),
      });
      notify("Destinatarios guardados.");
      setDraft(null);
      reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className={page.message}>{error}</p>;
  if (!data && loading) return <p className={page.message}>Cargando…</p>;

  return (
    <>
      <div className={page.card}>
        {types.length === 0 ? (
          <EmptyState title="Sin tipos de notificación" />
        ) : (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Quién la recibe</th>
                </tr>
              </thead>

              <tbody>
                {types.map((type) => (
                  <tr
                    key={type.notificationTypeId}
                    className={`${page.rowClickable} ${type.active ? "" : page.rowMuted}`}
                    onClick={() => edit(type)}
                  >
                    <td>
                      {type.name}
                      <span className={page.secondaryText}>{type.category}</span>
                    </td>

                    <td>
                      {type.roles.map((role) => (
                        <span key={`role-${role.roleId}`} className={page.chip}>
                          {role.name}
                        </span>
                      ))}
                      {type.users.map((user) => (
                        <span key={`user-${user.userId}`} className={page.chip}>
                          {user.name}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SidePanel
        open={draft !== null}
        title={draft?.name ?? ""}
        busy={saving}
        onClose={() => setDraft(null)}
        footer={
          <div className={ui.panelActions}>
            <Button onClick={() => setDraft(null)} disabled={saving}>
              Cancelar
            </Button>
            {canEdit && (
              <Button variant="contained" onClick={save} disabled={saving || !draft?.template.trim()}>
                Guardar
              </Button>
            )}
          </div>
        }
      >
        {draft && (
          <div className={page.formStack}>
            <Field label="Mensaje">
              <TextField
                multiline
                minRows={3}
                fullWidth
                disabled={!canEdit}
                value={draft.template}
                onChange={(event) => change("template", event.target.value.slice(0, TEMPLATE_LIMIT))}
              />
            </Field>

            <Field label="Roles">
              <Autocomplete
                multiple
                size="small"
                disabled={!canEdit}
                options={roles}
                value={draft.roles}
                getOptionLabel={(role) => role.name}
                isOptionEqualToValue={(option, value) => option.roleId === value.roleId}
                onChange={(_, value) => change("roles", value)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Field>

            <Field label="Usuarios">
              <Autocomplete
                multiple
                size="small"
                disabled={!canEdit}
                options={userOptions}
                value={draft.users}
                filterOptions={(options) => options}
                getOptionLabel={(user) => user.name}
                isOptionEqualToValue={(option, value) => option.userId === value.userId}
                onInputChange={(_, text, reason) => {
                  if (reason === "input") findUsers(text);
                }}
                onChange={(_, value) => change("users", value)}
                noOptionsText="Escribe para buscar"
                renderInput={(params) => <TextField {...params} />}
              />
            </Field>

            <FormControlLabel
              label="Activa"
              control={
                <Switch
                  size="small"
                  disabled={!canEdit}
                  checked={draft.active}
                  onChange={(event) => change("active", event.target.checked)}
                />
              }
            />
          </div>
        )}
      </SidePanel>
    </>
  );
};

export default RecipientsTab;
