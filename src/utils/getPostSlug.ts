import type { IPostItem } from "./IPostItem";

export function getPostSlug(post: IPostItem) {
  let slug = post.filePath ?? "";
  const match_path = slug.match(/([^\/]+)\/?$/);
  if (match_path) {
    slug = match_path[1];
  }
  const match_name = slug.match(/\d{4}-\d{2}-\d{2}-(.+)\.md/);
  if (match_name) {
    slug = match_name[1];
  }
  return slug;
}
