export const PERMISSION = {
  READ: 1,
  CREATE: 2,
  UPDATE: 4,
  DELETE: 8,
  FULL: 15,
};

const ACTION_TO_FLAG = {
  read: PERMISSION.READ,
  create: PERMISSION.CREATE,
  update: PERMISSION.UPDATE,
  delete: PERMISSION.DELETE,
};

export const hasFlag = (value, action) => {
  const flag = ACTION_TO_FLAG[action];

  return Boolean(flag) && (value & flag) === flag;
};