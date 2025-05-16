import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { getPostLink } from "../utils/getPostLink";
import { getPostDate } from "../utils/getPostDate";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: getPostDate(post),
      description: post.data.excerpt,
      link: getPostLink(post),
    })),
  });
}
