import { ROLES } from "./Roles";

export const PROFILE_ROLE_MAP = {
  [ROLES.STUDENT]: "student",
  [ROLES.TEACHER]: "teacher",
  [ROLES.PARENT]: "parent",
};

export const PROFILE_LABELS = {
  [ROLES.STUDENT]: "Estudiante",
  [ROLES.TEACHER]: "Profesor",
  [ROLES.PARENT]: "Padre/Acudiente",
  [ROLES.ADMIN]: "Administrador",
};

const ROLE_ALIASES = {
  Padre: ROLES.PARENT,
};

const normalizeRole = (role) => ROLE_ALIASES[role] ?? role;

export const roleLabel = (role) => PROFILE_LABELS[normalizeRole(role)] ?? role;

export const getRoleOptions = (session) => {
  const roles = session?.roles ?? [];
  const profiles = session?.profiles ?? {};

  const profileOptions = Object.entries(PROFILE_ROLE_MAP)
    .filter(([, profileKey]) => profiles[profileKey]?.active)
    .map(([role]) => ({ role, label: roleLabel(role), kind: "profile" }));

  const shownProfileRoles = new Set(profileOptions.map((option) => option.role));
  const seenOtherRoles = new Set();

  const otherRoleOptions = roles
    .map(normalizeRole)
    .filter((role) => {
      const profileKey = PROFILE_ROLE_MAP[role];
      if (profileKey && profiles[profileKey]?.active) return false;
      if (shownProfileRoles.has(role)) return false;
      if (seenOtherRoles.has(role)) return false;
      seenOtherRoles.add(role);
      return true;
    })
    .map((role) => ({ role, label: roleLabel(role), kind: "role" }));

  return [...profileOptions, ...otherRoleOptions];
};