export function truncateMiddle(text, max = 42) {
  if (!text || text.length <= max) return text || "";
  const keep = Math.floor((max - 3) / 2);
  return `${text.slice(0, keep)}...${text.slice(-keep)}`;
}

export function truncateEnd(text, max = 48) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
