export const prettyStatus = (value = "") => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function isOverdue(date, status) {
  return status !== "completed" && new Date(date) < new Date(new Date().toDateString());
}

export function unwrapResults(payload) {
  return Array.isArray(payload) ? payload : payload?.results || [];
}
