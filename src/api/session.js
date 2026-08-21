let isRedirecting = false;
let sessionController = new AbortController();

export const getSessionSignal = () => sessionController.signal;

export const handleUnauthorized = () => {
  if (isRedirecting) return;
  isRedirecting = true;

  sessionController.abort();

  window.location.href = '/login';
};