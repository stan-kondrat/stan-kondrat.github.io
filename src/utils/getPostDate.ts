import type { IPostItem } from "./IPostItem";

export function getPostDate(post: IPostItem): Date {
  let filename = post.filePath ?? "";
  const match_path = filename.match(/([^\/]+)\/?$/);
  if (match_path) {
    filename = match_path[1];
  }
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (match) {
    const dateStr = match[1]; // "2025-02-15"
    const date = new Date(dateStr + "T00:00:00Z"); // Convert to UTC Date
    if (!isNaN(date.getTime())) {
      // console.log("Valid UTC Date:", date.toISOString()); // Output: "2025-02-15T00:00:00.000Z"
      return date;
    } else {
      // console.log("Invalid Date");
    }
  }
  return new Date();
}
