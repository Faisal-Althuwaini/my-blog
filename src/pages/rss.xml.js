import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const item = {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/${post.slug}/`,
			};
			
			// Add image if it exists
			if (post.data.heroImage) {
				item.enclosure = {
					url: new URL(post.data.heroImage, context.site).href,
					type: 'image/jpeg',
					length: 0, // RSS requires length, but we don't know it
				};
			}
			
			return item;
		}),
	});
}
