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

interface TrackPayload {
	type: 'pageview' | 'event';
	pathname?: string;
	referrer?: string;
	eventName?: string;
	label?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	if (!env.NUC7_STATS) {
		return Response.json({ error: 'Missing NUC7_STATS binding.' }, { status: 500 });
	}

	const payload = (await request.json().catch(() => null)) as TrackPayload | null;
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
		const pathname = payload.pathname || '/';
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
		increment(daily.events, payload.eventName);
	}

	await writeDaily(env.NUC7_STATS, daily);

	return new Response(JSON.stringify({ ok: true }), { headers });
};
