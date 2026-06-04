import type { CollectionEntry } from 'astro:content';

export type AppEntry = CollectionEntry<'apps'>;

export const categoryMeta = {
	kids: {
		title: 'Kids Home Schooling',
		strap: 'Playful, repeatable lessons built for early routines at home.',
		copy: 'Letter tracing, counting confidence, and curiosity-first lessons designed for calm practice instead of screen overload.',
		image: '/images/sections/kids-learning.png',
	},
	adults: {
		title: 'Parent Productivity',
		strap: 'Small focus tools for parents whose days already feel full.',
		copy: 'NUC7 parent productivity apps aim for less noise, clearer intent, and better follow-through without turning family life into a dashboard.',
		image: '/images/sections/adults-focus.png',
	},
} as const;

export const statusLabels = {
	public: 'Available now',
	'closed-testing': 'Closed testing',
} as const;

export function sortApps(a: AppEntry, b: AppEntry) {
	return a.data.order - b.data.order;
}

export function byCategory(apps: AppEntry[], category: AppEntry['data']['category']) {
	return apps.filter((app) => app.data.category === category);
}
