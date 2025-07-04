import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.heroImage 
				? `${new URL(post.data.heroImage, context.site).href}\n${post.data.description}`
				: post.data.description,
			pubDate: post.data.pubDate,
			link: `/${post.slug}/`,
		})),
	});
}
