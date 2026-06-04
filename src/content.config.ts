import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const apps = defineCollection({
	loader: glob({ base: './src/content/apps', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		category: z.enum(['kids', 'adults']),
		status: z.enum(['public', 'closed-testing']),
		order: z.number().int().nonnegative(),
		featured: z.boolean().default(false),
		tagline: z.string(),
		summary: z.string(),
		packageName: z.string().optional(),
		playStoreUrl: z.string().url().optional(),
		privacySlug: z.string().optional(),
		heroImage: z.string(),
		accent: z.string(),
		availabilityNote: z.string().optional(),
		highlights: z.array(z.string()).min(2).max(5),
	}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
	}),
});

const privacy = defineCollection({
	loader: glob({ base: './src/content/privacy', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		appName: z.string(),
		description: z.string(),
		lastUpdated: z.string(),
		packageName: z.string().optional(),
		audience: z.enum(['kids', 'general']).default('general'),
	}),
});

const answerPageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	eyebrow: z.string(),
	directAnswer: z.string(),
	answerPoints: z.array(z.string()).default([]),
	category: z.enum(['kids', 'adults', 'parents', 'privacy']).default('parents'),
	heroImage: z.string().default('/images/hero-studio.png'),
	relatedApps: z.array(z.string()).default([]),
	relatedGuides: z.array(z.string()).default([]),
	searchIntents: z.array(z.string()).default([]),
	lastReviewed: z.string().optional(),
});

const hubs = defineCollection({
	loader: glob({ base: './src/content/hubs', pattern: '**/*.md' }),
	schema: answerPageSchema,
});

const guides = defineCollection({
	loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
	schema: answerPageSchema.extend({
		ageRange: z.string().optional(),
	}),
});

export const collections = {
	apps,
	pages,
	privacy,
	hubs,
	guides,
};
