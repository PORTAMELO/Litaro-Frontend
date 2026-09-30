import { useCallback, useMemo } from "react";
import { useAuth } from "./UseAuth";
import { hasFlag } from "../utils/Permissions";

export function usePermissions() {
  const { permissions } = useAuth();

  const byTable = useMemo(() => {
    const map = new Map();

    (permissions ?? []).forEach((permission) => map.set(permission.tableName, permission));

    return map;
  }, [permissions]);

  const can = useCallback((tableName, action) => hasFlag(byTable.get(tableName)?.permissions ?? 0, action), [byTable]);

  const viewFor = useCallback((tableName) => byTable.get(tableName)?.view ?? null, [byTable]);

  return { can, viewFor, ready: permissions !== null };
}