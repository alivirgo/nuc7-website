import type { Env } from './_shared';
import {
	browserFromUserAgent,
	deviceFromUserAgent,
	increment,
	normalizeReferrer,
	readDaily,
	todayKey,
	visitorCookieState,
	writeDaily,
} from './_shared';

const MAX_BODY_BYTES = 2048;
const MAX_TRACK_REQUESTS_PER_MINUTE = 45;

interface TrackPayload {
	type: 'pageview' | 'event';
	pathname?: string;
	referrer?: string;
	eventName?: string;
	label?: string;
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

function cleanEventName(eventName = '') {
	return eventName.replace(/[^a-z0-9._:-]/gi, '').slice(0, 80);
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
	const headers = new Headers({
		'Content-Type': 'application/json',
		'Cache-Control': 'no-store',
	});

	if (payload.type === 'pageview') {
		const pathname = cleanPathname(payload.pathname);
		const userAgent = request.headers.get('user-agent') ?? '';
		const country = request.headers.get('cf-ipcountry') ?? 'Unknown';
		const cookies = visitorCookieState(request, date);

		if (cookies.isNewVisitor) {
			daily.visitors += 1;
		}

		for (const cookieHeader of cookies.headers) {
			headers.append('Set-Cookie', cookieHeader);
		}

		daily.pageViews += 1;
		increment(daily.pages, pathname);
		increment(daily.referrers, normalizeReferrer(payload.referrer ?? ''));
		increment(daily.countries, country);
		increment(daily.devices, deviceFromUserAgent(userAgent));
		increment(daily.browsers, browserFromUserAgent(userAgent));
	}

	if (payload.type === 'event' && payload.eventName) {
		const eventName = cleanEventName(payload.eventName);
		if (eventName) {
			increment(daily.events, eventName);
		}
	}

	await writeDaily(env.NUC7_STATS, daily);

	return new Response(JSON.stringify({ ok: true }), { headers });
};
