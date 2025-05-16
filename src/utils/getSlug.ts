export function getSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
}
