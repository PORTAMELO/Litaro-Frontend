import { PATHS } from "@/shared/utils/Paths";

let isRedirecting = false;

let sessionController = new AbortController();

export const getSessionSignal = () => {
  return sessionController.signal;
};

export const handleUnauthorized = () => {
  if (isRedirecting) {
    return;
  }

  if (window.location.pathname.toLowerCase() === PATHS.login.toLowerCase()) {
    return;
  }

  isRedirecting = true;

  sessionController.abort();

  window.location.href = PATHS.login;
};