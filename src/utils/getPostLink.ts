import { getPostSlug } from "./getPostSlug";
import { getSlug } from "./getSlug";
import type { IPostItem } from "./IPostItem";

export function getPostLink(post: IPostItem): string {
  return `${getSlug(post.data.categories)}/${getPostSlug(post)}`;
}
