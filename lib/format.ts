const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}

export function formatDateISO(value: Date) {
  return value.toISOString().split("T")[0];
}
