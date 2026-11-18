import { colors } from "@/shared/styles/tokens";
export const STATE = {
  UNREAD: { label: "No leída", color: colors.primary },
  PENDING: { label: "Pendiente", color: colors.warning },
  DONE: { label: "Realizada", color: colors.textDisabled },
};

export const NOTIFICATIONS_CHANGED = "litaro:notifications-changed";

export const announceChange = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

export const TEMPLATE_LIMIT = 500;

export const NOTE_LIMIT = 300;
