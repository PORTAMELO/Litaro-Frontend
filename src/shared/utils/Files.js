export const CLIENT_HEADERS = { "X-Requested-With": "XMLHttpRequest" };

export const openBlob = (blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
