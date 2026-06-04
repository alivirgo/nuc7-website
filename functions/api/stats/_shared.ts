export interface Env {
	NUC7_STATS: KVNamespace;
	SITE_STATS_TOKEN?: string;
	SITE_TIMEZONE?: string;
	OWNER_GITHUB_EMAIL?: string;
	SESSION_SECRET?: string;
}

export interface DailyStats {
	date: string;
	visitors: number;
	pageViews: number;
	pages: Record<string, number>;
	referrers: Record<string, number>;
	countries: Record<string, number>;
	devices: Record<string, number>;
	browsers: Record<string, number>;
	events: Record<string, number>;
}

const PREFIX = 'stats:daily:';

export function todayKey(timeZone = 'UTC') {
	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	return formatter.format(new Date());
}

export function dailyKey(date: string) {
	return `${PREFIX}${date}`;
}

export function blankDaily(date: string): DailyStats {
	return {
		date,
		visitors: 0,
		pageViews: 0,
		pages: {},
		referrers: {},
		countries: {},
		devices: {},
		browsers: {},
		events: {},
	};
}

export async function readDaily(kv: KVNamespace, date: string) {
	const data = await kv.get<DailyStats>(dailyKey(date), 'json');
	return data ?? blankDaily(date);
}

export async function writeDaily(kv: KVNamespace, stats: DailyStats) {
	await kv.put(dailyKey(stats.date), JSON.stringify(stats));
}

export function increment(record: Record<string, number>, key: string, amount = 1) {
	record[key] = (record[key] ?? 0) + amount;
}

export function topEntries(record: Record<string, number>, limit = 10) {
	return Object.entries(record)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([label, count]) => ({ label, count }));
}

export function browserFromUserAgent(userAgent: string) {
	if (/edg/i.test(userAgent)) return 'Edge';
	if (/chrome|crios/i.test(userAgent)) return 'Chrome';
	if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
	if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return 'Safari';
	if (/samsungbrowser/i.test(userAgent)) return 'Samsung Internet';
	return 'Other';
}

export function deviceFromUserAgent(userAgent: string) {
	if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
	if (/mobi|android/i.test(userAgent)) return 'Mobile';
	return 'Desktop';
}

export function normalizeReferrer(referrer: string) {
	if (!referrer) return 'Direct';

	try {
		const parsed = new URL(referrer);
		const host = parsed.hostname.replace(/^www\./, '');
		return host.includes('nuc7.com') ? 'Internal' : host;
	} catch {
		return 'Direct';
	}
}

export function parseCookies(header: string | null) {
	return (header ?? '')
		.split(';')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.reduce<Record<string, string>>((cookies, entry) => {
			const [key, ...value] = entry.split('=');
			cookies[key] = value.join('=');
			return cookies;
		}, {});
}

export function visitorCookieState(request: Request, date: string) {
	const cookies = parseCookies(request.headers.get('cookie'));
	const visitorId = cookies.nuc7_vid;
	const lastSeen = cookies.nuc7_last;
	const isNewVisitor = !visitorId || lastSeen !== date;
	const finalVisitorId = visitorId || crypto.randomUUID().slice(0, 18);

	return {
		isNewVisitor,
		headers: [
			`nuc7_vid=${finalVisitorId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
			`nuc7_last=${date}; Path=/; Max-Age=172800; SameSite=Lax; Secure`,
		],
	};
}

export function unauthorizedResponse() {
	return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export function requireStatsToken(request: Request, env: Env) {
	if (!env.SITE_STATS_TOKEN) return null;

	const authHeader = request.headers.get('authorization') ?? '';
	const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
	const urlToken = new URL(request.url).searchParams.get('token') ?? '';
	const token = bearer || urlToken;

	return token === env.SITE_STATS_TOKEN ? null : unauthorizedResponse();
}
