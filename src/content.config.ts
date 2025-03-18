import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		categories: z.string(),
		tags: z.string(),
		excerpt: z.string(), //.optional(),
	}),
});

export const collections = {  posts };
