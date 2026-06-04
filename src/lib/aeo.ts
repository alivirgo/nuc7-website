import type { CollectionEntry } from 'astro:content';

export interface FAQ {
	question: string;
	answer: string;
}

export interface AppAnswerProfile {
	bestFor: string;
	ageRange: string;
	skills: string[];
	homeUse: string;
	privacyNote: string;
	comparison: string;
	faqs: FAQ[];
}

export const siteFaqs: FAQ[] = [
	{
		question: 'Which NUC7 app is best for a preschool child?',
		answer:
			'For a preschool child who is beginning letters, numbers, and hand-control practice, TraceLearn Kids is the strongest starting point. English 1 is a better fit when the parent wants vocabulary and early English practice, while Math 1 is aimed at early number confidence.',
	},
	{
		question: 'Are NUC7 kids apps made for home-schooling routines?',
		answer:
			'Yes. The kids line is designed around short, repeatable home practice sessions. The goal is not to replace a parent or teacher, but to give families a calm practice tool that can fit into daily learning routines.',
	},
	{
		question: 'Do the kids apps focus on privacy?',
		answer:
			'The public kids privacy policies are kept visible and stable on the site. The kids apps are described around parent trust, short practice, and clear data handling rather than advertising-driven engagement.',
	},
	{
		question: 'Which NUC7 app helps with tracing and handwriting readiness?',
		answer:
			'TraceLearn Kids is the best match for tracing and handwriting readiness. It focuses on guided tracing, visual pacing, and recognition practice for letters, numbers, and early patterns.',
	},
	{
		question: 'Which NUC7 app is best for early English learning?',
		answer:
			'English 1 - MnM Home Schooling is the best match for parents who want early English vocabulary, tracing, and first-language confidence in a simple app experience.',
	},
	{
		question: 'Which NUC7 apps are available now?',
		answer:
			'English 1 - MnM Home Schooling and TraceLearn Kids are public. Math 1, Curiosity 1, Why Did I Open My Phone, and AI Maths Calculator are represented as closed-testing apps until wider release.',
	},
];

export const parentSafetyFaqs: FAQ[] = [
	{
		question: 'What should parents look for in a safe learning app for children?',
		answer:
			'Parents should look for clear privacy policies, age-appropriate activities, limited distractions, simple navigation, and a learning goal that is easy to understand before the child starts using the app.',
	},
	{
		question: 'Is an ad-free learning app better for young children?',
		answer:
			'For young children, an ad-free or low-distraction experience is usually better because it keeps attention on practice instead of sending the child into unrelated content or confusing prompts.',
	},
	{
		question: 'How long should a young child use a learning app each day?',
		answer:
			'Short sessions are usually best. A 5 to 10 minute practice window can be enough for tracing, letters, counting, or recognition work, especially when a parent follows up with real-world conversation or paper practice.',
	},
	{
		question: 'Can a learning app replace parent-guided teaching?',
		answer:
			'No. A learning app works best as a practice companion. Parents still provide context, encouragement, correction, and real-life examples that software cannot fully replace.',
	},
];

export const kidsCategoryFaqs: FAQ[] = [
	{
		question: 'What is the best first NUC7 app for kids?',
		answer:
			'TraceLearn Kids is the most flexible first choice because tracing and recognition practice support several early skills at once. English 1 is better when the parent wants language-first practice.',
	},
	{
		question: 'Are these apps suitable for preschool or kindergarten preparation?',
		answer:
			'The kids apps are positioned for early routines like tracing, number recognition, English vocabulary, and child-friendly practice. Parents can use them as part of preschool or kindergarten-readiness work at home.',
	},
	{
		question: 'Which app should I choose for a child who avoids writing?',
		answer:
			'TraceLearn Kids is the best fit because it starts with guided digital tracing. Parents can pair it with short paper practice once the child feels more confident.',
	},
	{
		question: 'Which app should I choose for early math?',
		answer:
			'Math 1 - MnM Home Schooling is the early numeracy app in the NUC7 kids lineup. It is currently listed as closed testing, so parents should use the public app status before expecting general availability.',
	},
	...parentSafetyFaqs,
];

export const adultsCategoryFaqs: FAQ[] = [
	{
		question: 'What kinds of productivity apps does NUC7 build for parents?',
		answer:
			'NUC7 parent productivity apps are focused tools for attention, intention, and practical problem solving. They are meant to reduce friction rather than add another complicated dashboard.',
	},
	{
		question: 'Which app helps with intentional phone use?',
		answer:
			'Why Did I Open My Phone? is designed for the moment when a user picks up a phone on autopilot and wants a small pause before falling into distraction.',
	},
	{
		question: 'Which app helps with math questions?',
		answer:
			'AI Maths Calculator is positioned as a practical math-help tool for parents, older students, and everyday problem-solving situations. It is currently in closed testing.',
	},
	{
		question: 'Are the parent productivity apps public?',
		answer:
			'The parent productivity apps shown on the site are currently represented as closed-testing apps, so the pages describe the product direction without presenting them as generally available releases.',
	},
];

export const appAnswerProfiles: Record<string, AppAnswerProfile> = {
	'tracelearn-kids': {
		bestFor:
			'TraceLearn Kids is best for parents who want a simple tracing app for letters, numbers, early shapes, and handwriting-readiness practice at home.',
		ageRange: 'Early learners, especially preschool and kindergarten-readiness routines.',
		skills: ['Tracing control', 'Letter and number recognition', 'Pattern confidence', 'Short daily practice'],
		homeUse:
			'Use TraceLearn Kids for a short guided session, then ask the child to repeat one shape, letter, or number on paper or in conversation.',
		privacyNote:
			'TraceLearn Kids has a public privacy policy route on nuc7.com and is presented as a child-friendly product with clear privacy visibility.',
		comparison:
			'Choose TraceLearn Kids before English 1 when the main goal is tracing motion and hand-control practice. Choose English 1 when the main goal is early vocabulary and English confidence.',
		faqs: [
			{
				question: 'Is TraceLearn Kids good for preschool children?',
				answer:
					'Yes. It is positioned for early learners who need short, friendly tracing and recognition practice before longer handwriting tasks.',
			},
			{
				question: 'Can TraceLearn Kids help with handwriting readiness?',
				answer:
					'TraceLearn Kids can support handwriting readiness by helping a child repeat guided motions, follow paths, and build confidence with early shapes, letters, and numbers.',
			},
			{
				question: 'Is TraceLearn Kids only for English letters?',
				answer:
					'The app page describes tracing practice for letters, numbers, and early pattern confidence, so it is broader than a single vocabulary drill.',
			},
			...parentSafetyFaqs,
		],
	},
	'english-1-mnm-home-schooling': {
		bestFor:
			'English 1 is best for parents who want a gentle first English-learning app with vocabulary practice, tracing, and repeatable home-schooling sessions.',
		ageRange: 'Young children building first English vocabulary and early writing confidence.',
		skills: ['Early vocabulary', 'English recognition', 'Tracing confidence', 'Repeat practice'],
		homeUse:
			'Use English 1 as a short language warm-up, then ask the child to say the word, trace a related shape, or point to a matching real object at home.',
		privacyNote:
			'English 1 has a stable public privacy policy route for Google Play and parent review.',
		comparison:
			'Choose English 1 when language and vocabulary are the goal. Choose TraceLearn Kids when tracing and pattern control are the main need.',
		faqs: [
			{
				question: 'Is English 1 good for early English learning at home?',
				answer:
					'Yes. It is designed as a simple home companion for early vocabulary, tracing, and confidence-building practice.',
			},
			{
				question: 'Can parents use English 1 for home-schooling?',
				answer:
					'Yes. Parents can use it as a short daily English practice activity inside a wider home-schooling routine.',
			},
			{
				question: 'Is English 1 better than TraceLearn Kids?',
				answer:
					'They answer different needs. English 1 is language-first, while TraceLearn Kids is tracing-first.',
			},
			...parentSafetyFaqs,
		],
	},
	'math-1-mnm-home-schooling': {
		bestFor:
			'Math 1 is best for families looking for beginner-friendly number recognition, counting confidence, and early math routines at home.',
		ageRange: 'Early learners beginning numbers, counting, and simple math recognition.',
		skills: ['Counting', 'Number recognition', 'Early numeracy', 'Routine-based practice'],
		homeUse:
			'Use Math 1 in a short session, then connect the same idea to real household objects, snacks, toys, or steps so the child sees math outside the screen.',
		privacyNote:
			'Math 1 has a public privacy policy route and is clearly marked as a closed-testing app on the site.',
		comparison:
			'Choose Math 1 when the main goal is early numeracy. Choose English 1 or TraceLearn Kids when language or tracing comes first.',
		faqs: [
			{
				question: 'Is Math 1 available to all families now?',
				answer:
					'Math 1 is shown as a closed-testing app, so the site describes its direction without presenting it as a general public release.',
			},
			{
				question: 'What math skills does Math 1 focus on?',
				answer:
					'The app is positioned around number recognition, counting practice, and beginner math habits for home routines.',
			},
			...parentSafetyFaqs,
		],
	},
	'curiosity-1-mnm-home-schooling': {
		bestFor:
			'Curiosity 1 is best for parent-guided discovery, observation, and broader early-learning prompts inside the MnM Home Schooling family.',
		ageRange: 'Young learners who benefit from parent-guided exploration and discovery.',
		skills: ['Observation', 'Question asking', 'Discovery habits', 'Parent-guided exploration'],
		homeUse:
			'Use Curiosity 1 as a conversation starter. After the app activity, ask the child what they noticed, what changed, and what they want to explore next.',
		privacyNote:
			'Curiosity 1 is still in closed testing and should receive a finalized public privacy page before wider release.',
		comparison:
			'Choose Curiosity 1 for exploration. Choose TraceLearn Kids, English 1, or Math 1 for more specific tracing, language, or number practice.',
		faqs: [
			{
				question: 'Is Curiosity 1 a tracing app?',
				answer:
					'No. Curiosity 1 is positioned more around discovery and parent-guided exploration than tracing repetition.',
			},
			{
				question: 'Is Curiosity 1 publicly available?',
				answer:
					'Curiosity 1 is represented as a closed-testing app, so parents should treat it as upcoming rather than generally available.',
			},
			...parentSafetyFaqs,
		],
	},
	'why-did-i-open-my-phone': {
		bestFor:
			'Why Did I Open My Phone? is best for parents who want a tiny pause before distracted phone use turns into automatic scrolling or app switching.',
		ageRange: 'Parents and older users who want more intentional device habits.',
		skills: ['Intentional phone use', 'Focus recovery', 'Habit awareness', 'Gentle self-interruption'],
		homeUse:
			'Use it when phone checking feels automatic. The product direction is to help users remember the purpose behind opening the phone.',
		privacyNote:
			'The app has a public privacy policy route and is described as tracking intention and focus patterns locally on-device.',
		comparison:
			'Choose this app for phone-use intention. Choose AI Maths Calculator for practical math help.',
		faqs: [
			{
				question: 'Is Why Did I Open My Phone? for children?',
				answer:
					'No. It belongs to the parent productivity category and is designed around intentional phone use for parents and older users.',
			},
			{
				question: 'Is this a normal reminder app?',
				answer:
					'No. The product idea is more specific: create a pause at the moment of phone pickup so the user can remember their intention.',
			},
			...adultsCategoryFaqs.slice(0, 2),
		],
	},
	'ai-maths-calculator': {
		bestFor:
			'AI Maths Calculator is best for parents, older students, and productivity-minded users who want help turning a confusing math question into a clearer next step.',
		ageRange: 'Parents, older students, and everyday math-help situations.',
		skills: ['Math understanding', 'Problem solving', 'Step clarity', 'Everyday calculation support'],
		homeUse:
			'Use it when the next math step is unclear, then review the explanation rather than only copying an answer.',
		privacyNote:
			'AI Maths Calculator is still in closed testing, and privacy details should be finalized before public launch, especially if remote AI services are used.',
		comparison:
			'Choose AI Maths Calculator for math help. Choose Why Did I Open My Phone? for focus and device-intention support.',
		faqs: [
			{
				question: 'Is AI Maths Calculator for young children?',
				answer:
					'No. It is positioned for parents, older students, and practical everyday math help rather than early-childhood learning.',
			},
			{
				question: 'Is AI Maths Calculator public now?',
				answer:
					'It is shown as a closed-testing app, so the site describes its direction without presenting it as generally available.',
			},
			...adultsCategoryFaqs.slice(1, 3),
		],
	},
};

export const hubFaqs: Record<string, FAQ[]> = {
	'for-parents': siteFaqs.concat(parentSafetyFaqs),
	'kids-learning-apps': kidsCategoryFaqs,
	'kids-tracing-apps': appAnswerProfiles['tracelearn-kids'].faqs,
	'kids-english-learning-apps': appAnswerProfiles['english-1-mnm-home-schooling'].faqs,
	'kids-math-learning-apps': appAnswerProfiles['math-1-mnm-home-schooling'].faqs,
	'preschool-learning-apps': kidsCategoryFaqs,
	'kindergarten-learning-apps': kidsCategoryFaqs,
	'home-schooling-apps': siteFaqs.concat(kidsCategoryFaqs.slice(0, 4)),
	'privacy-safe-kids-apps': parentSafetyFaqs.concat(siteFaqs.slice(2, 4)),
	'no-ads-kids-learning-apps': parentSafetyFaqs,
	'offline-kids-learning-apps': parentSafetyFaqs,
};

export const searchIntentMap = [
	['best tracing app for kids', '/kids-tracing-apps/'],
	['best app for preschool letter tracing', '/kids-tracing-apps/'],
	['kids app for handwriting readiness', '/kids-tracing-apps/'],
	['best English learning app for young children', '/kids-english-learning-apps/'],
	['home schooling English app for kids', '/kids-english-learning-apps/'],
	['best math app for early learners', '/kids-math-learning-apps/'],
	['kindergarten number recognition app', '/kids-math-learning-apps/'],
	['safe learning app for children', '/privacy-safe-kids-apps/'],
	['kids learning app with no ads', '/no-ads-kids-learning-apps/'],
	['offline learning app for children', '/offline-kids-learning-apps/'],
	['home-schooling apps for busy parents', '/home-schooling-apps/'],
	['preschool learning apps for home', '/preschool-learning-apps/'],
	['kindergarten readiness apps', '/kindergarten-learning-apps/'],
] as const;

export function faqsToSchema(faqs: FAQ[], url: URL) {
	return {
		'@type': 'FAQPage',
		'@id': `${url.href}#faq`,
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
	};
}

export function appToSoftwareSchema(app: CollectionEntry<'apps'>, url: URL) {
	return {
		'@type': 'MobileApplication',
		'@id': `${url.href}#app`,
		name: app.data.title,
		url: url.href,
		image: new URL(app.data.heroImage, url.origin).href,
		applicationCategory:
			app.data.category === 'kids' ? 'EducationalApplication' : 'ProductivityApplication',
		operatingSystem: 'Android',
		description: app.data.summary,
		...(app.data.playStoreUrl ? { sameAs: [app.data.playStoreUrl] } : {}),
		...(app.data.packageName ? { identifier: app.data.packageName } : {}),
		offers: {
			'@type': 'Offer',
			availability:
				app.data.status === 'public' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
			price: '0',
			priceCurrency: 'USD',
		},
	};
}

export function itemListSchema(items: { title: string; href: string }[], url: URL) {
	return {
		'@type': 'ItemList',
		'@id': `${url.href}#item-list`,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.title,
			url: new URL(item.href, url.origin).href,
		})),
	};
}

export function breadcrumbSchema(items: { name: string; href: string }[], url: URL) {
	return {
		'@type': 'BreadcrumbList',
		'@id': `${url.href}#breadcrumb`,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: new URL(item.href, url.origin).href,
		})),
	};
}
