export const STATE = {
  UNREAD: { label: "No leída", color: "#16113a" },
  PENDING: { label: "Pendiente", color: "#d97706" },
  DONE: { label: "Realizada", color: "#9ca3af" },
};

export const NOTIFICATIONS_CHANGED = "litaro:notifications-changed";

export const announceChange = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

export const TEMPLATE_LIMIT = 500;

export const NOTE_LIMIT = 300;
