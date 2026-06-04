import type { Env } from './_shared';
import {
	browserFromUserAgent,
	botSignalFromUserAgent,
	deviceFromUserAgent,
	increment,
	normalizeReferrer,
	operatingSystemFromUserAgent,
	readDaily,
	sourceGroup,
	todayKey,
	visitorCookieState,
	writeDaily,
} from './_shared';

const MAX_BODY_BYTES = 2048;
const MAX_TRACK_REQUESTS_PER_MINUTE = 45;
const MAX_RECENT_ACTIVITY = 80;

interface TrackPayload {
	type: 'pageview' | 'event';
	pathname?: string;
	search?: string;
	referrer?: string;
	eventName?: string;
	label?: string;
	title?: string;
	language?: string;
	timezone?: string;
	colorScheme?: string;
	screen?: string;
	viewport?: string;
	connectionType?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
}

function clientIp(request: Request) {
	return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

async function isRateLimited(kv: KVNamespace, request: Request) {
	const minute = Math.floor(Date.now() / 60000);
	const ip = clientIp(request);
	const key = `rate:stats-track:${minute}:${ip}`;
	const current = Number((await kv.get(key)) || '0');

	if (current >= MAX_TRACK_REQUESTS_PER_MINUTE) {
		return true;
	}

	await kv.put(key, String(current + 1), { expirationTtl: 180 });
	return false;
}

function cleanPathname(pathname = '/') {
	if (!pathname.startsWith('/')) return '/';
	return pathname.slice(0, 240);
}

function cleanValue(value = '', maxLength = 120) {
	return value.replace(/[<>]/g, '').trim().slice(0, maxLength) || 'Unknown';
}

function cleanEventName(eventName = '') {
	return eventName.replace(/[^a-z0-9._:-]/gi, '').slice(0, 80);
}

function pageCategory(pathname: string) {
	if (pathname === '/') return 'Home';
	if (pathname.startsWith('/apps/parent-productivity')) return 'Parent productivity apps';
	if (pathname.startsWith('/apps/kids')) return 'Kids apps category';
	if (pathname.startsWith('/apps/')) return 'App detail';
	if (pathname.startsWith('/guides/')) return 'Parent guide';
	if (pathname.startsWith('/comparisons/')) return 'App comparison';
	if (pathname.startsWith('/privacy-policies/')) return 'Privacy policy';
	if (pathname.startsWith('/for-parents')) return 'Parent hub';
	if (pathname.startsWith('/contact')) return 'Contact';
	if (pathname.startsWith('/about')) return 'About';
	return 'Other';
}

function searchEngine(referrer = '') {
	if (!referrer) return '';

	try {
		const host = new URL(referrer).hostname.toLowerCase();
		if (host.includes('google.')) return 'Google';
		if (host.includes('bing.')) return 'Bing';
		if (host.includes('duckduckgo.')) return 'DuckDuckGo';
		if (host.includes('yahoo.')) return 'Yahoo';
		if (host.includes('yandex.')) return 'Yandex';
		if (host.includes('baidu.')) return 'Baidu';
		if (host.includes('ecosia.')) return 'Ecosia';
	} catch {
		return '';
	}

	return '';
}

function socialSource(referrer = '') {
	if (!referrer) return '';

	try {
		const host = new URL(referrer).hostname.toLowerCase();
		if (host.includes('facebook.')) return 'Facebook';
		if (host.includes('instagram.')) return 'Instagram';
		if (host.includes('threads.')) return 'Threads';
		if (host.includes('twitter.') || host.includes('x.com')) return 'X / Twitter';
		if (host.includes('linkedin.')) return 'LinkedIn';
		if (host.includes('pinterest.')) return 'Pinterest';
		if (host.includes('reddit.')) return 'Reddit';
		if (host.includes('youtube.')) return 'YouTube';
		if (host.includes('tiktok.')) return 'TikTok';
	} catch {
		return '';
	}

	return '';
}

function searchTerm(search = '', referrer = '') {
	const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
	const campaignTerm = params.get('utm_term');
	if (campaignTerm) return cleanValue(campaignTerm, 100);

	if (!referrer) return '';
	try {
		const ref = new URL(referrer);
		return cleanValue(ref.searchParams.get('q') || ref.searchParams.get('query') || ref.searchParams.get('p') || '', 100);
	} catch {
		return '';
	}
}

function hourBucket(date = new Date()) {
	return String(date.getHours()).padStart(2, '0') + ':00';
}

function weekdayBucket(date = new Date()) {
	return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(date);
}

function requestColo(request: Request) {
	const cf = (request as Request & { cf?: { colo?: string } }).cf;
	return cf?.colo || 'Unknown';
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	if (!env.NUC7_STATS) {
		return Response.json({ error: 'Missing NUC7_STATS binding.' }, { status: 500 });
	}

	const contentLength = Number(request.headers.get('content-length') || 0);
	if (contentLength > MAX_BODY_BYTES) {
		return Response.json({ error: 'Payload too large.' }, { status: 413 });
	}

	if (await isRateLimited(env.NUC7_STATS, request)) {
		return Response.json({ error: 'Too many requests.' }, { status: 429 });
	}

	const rawPayload = await request.text();
	if (rawPayload.length > MAX_BODY_BYTES) {
		return Response.json({ error: 'Payload too large.' }, { status: 413 });
	}

	const payload = (() => {
		try {
			return (JSON.parse(rawPayload || 'null') as TrackPayload | null) ?? null;
		} catch {
			return null;
		}
	})();
	if (!payload || (payload.type !== 'pageview' && payload.type !== 'event')) {
		return Response.json({ error: 'Invalid payload.' }, { status: 400 });
	}

	const date = todayKey(env.SITE_TIMEZONE);
	const daily = await readDaily(env.NUC7_STATS, date);
	const now = new Date();
	const headers = new Headers({
		'Content-Type': 'application/json',
		'Cache-Control': 'no-store',
	});

	if (payload.type === 'pageview') {
		const pathname = cleanPathname(payload.pathname);
		const userAgent = request.headers.get('user-agent') ?? '';
		const country = request.headers.get('cf-ipcountry') ?? 'Unknown';
		const cookies = visitorCookieState(request, date);
		const referrer = payload.referrer ?? '';
		const source = sourceGroup(referrer);
		const term = searchTerm(payload.search ?? '', referrer);
		const searchSource = searchEngine(referrer);
		const social = socialSource(referrer);

		if (cookies.isNewVisitor) {
			daily.visitors += 1;
		} else {
			daily.returningVisitors = (daily.returningVisitors ?? 0) + 1;
		}

		for (const cookieHeader of cookies.headers) {
			headers.append('Set-Cookie', cookieHeader);
		}

		daily.pageViews += 1;
		increment(daily.pages, pathname);
		increment(daily.landingPages ??= {}, pathname);
		increment(daily.pageCategories ??= {}, pageCategory(pathname));
		increment(daily.referrers, normalizeReferrer(referrer));
		increment(daily.trafficSources ??= {}, source);
		increment(daily.countries, country);
		increment(daily.devices, deviceFromUserAgent(userAgent));
		increment(daily.browsers, browserFromUserAgent(userAgent));
		increment(daily.operatingSystems ??= {}, operatingSystemFromUserAgent(userAgent));
		increment(daily.botSignals ??= {}, botSignalFromUserAgent(userAgent));
		increment(daily.languages ??= {}, cleanValue(payload.language || request.headers.get('accept-language')?.split(',')[0] || 'Unknown', 60));
		increment(daily.timezones ??= {}, cleanValue(payload.timezone || 'Unknown', 80));
		increment(daily.colo ??= {}, requestColo(request));
		increment(daily.hours ??= {}, hourBucket(now));
		increment(daily.weekdays ??= {}, weekdayBucket(now));
		increment(daily.viewportSizes ??= {}, cleanValue(payload.viewport || 'Unknown', 40));
		increment(daily.screenSizes ??= {}, cleanValue(payload.screen || 'Unknown', 40));
		increment(daily.colorSchemes ??= {}, cleanValue(payload.colorScheme || 'Unknown', 20));
		increment(daily.connectionTypes ??= {}, cleanValue(payload.connectionType || 'Unknown', 30));

		if (searchSource) increment(daily.searchEngines ??= {}, searchSource);
		if (social) increment(daily.socialSources ??= {}, social);
		if (term) increment(daily.searchTerms ??= {}, term);
		if (payload.utmSource) increment(daily.utmSources ??= {}, cleanValue(payload.utmSource));
		if (payload.utmMedium) increment(daily.utmMediums ??= {}, cleanValue(payload.utmMedium));
		if (payload.utmCampaign) increment(daily.utmCampaigns ??= {}, cleanValue(payload.utmCampaign));
		if (payload.utmContent) increment(daily.utmContents ??= {}, cleanValue(payload.utmContent));
		if (payload.utmTerm) increment(daily.utmTerms ??= {}, cleanValue(payload.utmTerm));

		daily.recentActivity = [
			{
				at: now.toISOString(),
				type: 'pageview',
				pathname,
				referrer: normalizeReferrer(referrer),
				country,
				device: deviceFromUserAgent(userAgent),
				browser: browserFromUserAgent(userAgent),
				campaign: payload.utmCampaign ? cleanValue(payload.utmCampaign) : undefined,
				source,
			},
			...(daily.recentActivity ?? []),
		].slice(0, MAX_RECENT_ACTIVITY);
	}

	if (payload.type === 'event' && payload.eventName) {
		const pathname = cleanPathname(payload.pathname);
		const eventName = cleanEventName(payload.eventName);
		if (eventName) {
			increment(daily.events, eventName);
			if (payload.label) increment(daily.eventLabels ??= {}, cleanValue(`${eventName}: ${payload.label}`, 180));
			daily.recentActivity = [
				{
					at: now.toISOString(),
					type: 'event',
					pathname,
					eventName,
					label: payload.label ? cleanValue(payload.label, 140) : undefined,
				},
				...(daily.recentActivity ?? []),
			].slice(0, MAX_RECENT_ACTIVITY);
		}
	}

	await writeDaily(env.NUC7_STATS, daily);

	return new Response(JSON.stringify({ ok: true }), { headers });
};
