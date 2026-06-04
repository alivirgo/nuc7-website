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
	returningVisitors?: number;
	landingPages?: Record<string, number>;
	pageCategories?: Record<string, number>;
	searchTerms?: Record<string, number>;
	searchEngines?: Record<string, number>;
	socialSources?: Record<string, number>;
	trafficSources?: Record<string, number>;
	utmSources?: Record<string, number>;
	utmMediums?: Record<string, number>;
	utmCampaigns?: Record<string, number>;
	utmContents?: Record<string, number>;
	utmTerms?: Record<string, number>;
	languages?: Record<string, number>;
	timezones?: Record<string, number>;
	colo?: Record<string, number>;
	hours?: Record<string, number>;
	weekdays?: Record<string, number>;
	viewportSizes?: Record<string, number>;
	screenSizes?: Record<string, number>;
	colorSchemes?: Record<string, number>;
	connectionTypes?: Record<string, number>;
	operatingSystems?: Record<string, number>;
	botSignals?: Record<string, number>;
	eventLabels?: Record<string, number>;
	recentActivity?: RecentActivity[];
}

export interface RecentActivity {
	at: string;
	type: 'pageview' | 'event';
	pathname: string;
	referrer?: string;
	country?: string;
	device?: string;
	browser?: string;
	eventName?: string;
	label?: string;
	campaign?: string;
	source?: string;
}

export interface StatsHit {
	date: string;
	at: string;
	type: 'pageview' | 'event';
	pathname: string;
	referrer?: string;
	country?: string;
	device?: string;
	browser?: string;
	returningVisitor?: boolean;
	pageCategory?: string;
	searchTerm?: string;
	searchEngine?: string;
	socialSource?: string;
	trafficSource?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
	language?: string;
	timezone?: string;
	colo?: string;
	hour?: string;
	weekday?: string;
	viewport?: string;
	screen?: string;
	colorScheme?: string;
	connectionType?: string;
	operatingSystem?: string;
	botSignal?: string;
	eventName?: string;
	label?: string;
}

const PREFIX = 'stats:daily:';
const HIT_PREFIX = 'stats:hit:';

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

export function hitKey(hit: StatsHit) {
	return `${HIT_PREFIX}${hit.date}:${Date.parse(hit.at)}:${crypto.randomUUID()}`;
}

export function hitPrefix(date: string) {
	return `${HIT_PREFIX}${date}:`;
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
		returningVisitors: 0,
		landingPages: {},
		pageCategories: {},
		searchTerms: {},
		searchEngines: {},
		socialSources: {},
		trafficSources: {},
		utmSources: {},
		utmMediums: {},
		utmCampaigns: {},
		utmContents: {},
		utmTerms: {},
		languages: {},
		timezones: {},
		colo: {},
		hours: {},
		weekdays: {},
		viewportSizes: {},
		screenSizes: {},
		colorSchemes: {},
		connectionTypes: {},
		operatingSystems: {},
		botSignals: {},
		eventLabels: {},
		recentActivity: [],
	};
}

export function ensureDailyShape(stats: DailyStats) {
	const blank = blankDaily(stats.date);
	return {
		...blank,
		...stats,
		pages: stats.pages ?? {},
		referrers: stats.referrers ?? {},
		countries: stats.countries ?? {},
		devices: stats.devices ?? {},
		browsers: stats.browsers ?? {},
		events: stats.events ?? {},
		landingPages: stats.landingPages ?? {},
		pageCategories: stats.pageCategories ?? {},
		searchTerms: stats.searchTerms ?? {},
		searchEngines: stats.searchEngines ?? {},
		socialSources: stats.socialSources ?? {},
		trafficSources: stats.trafficSources ?? {},
		utmSources: stats.utmSources ?? {},
		utmMediums: stats.utmMediums ?? {},
		utmCampaigns: stats.utmCampaigns ?? {},
		utmContents: stats.utmContents ?? {},
		utmTerms: stats.utmTerms ?? {},
		languages: stats.languages ?? {},
		timezones: stats.timezones ?? {},
		colo: stats.colo ?? {},
		hours: stats.hours ?? {},
		weekdays: stats.weekdays ?? {},
		viewportSizes: stats.viewportSizes ?? {},
		screenSizes: stats.screenSizes ?? {},
		colorSchemes: stats.colorSchemes ?? {},
		connectionTypes: stats.connectionTypes ?? {},
		operatingSystems: stats.operatingSystems ?? {},
		botSignals: stats.botSignals ?? {},
		eventLabels: stats.eventLabels ?? {},
		recentActivity: stats.recentActivity ?? [],
	};
}

export async function readDaily(kv: KVNamespace, date: string) {
	const data = await kv.get<DailyStats>(dailyKey(date), 'json');
	return data ? ensureDailyShape(data) : blankDaily(date);
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

export function operatingSystemFromUserAgent(userAgent: string) {
	if (/windows nt/i.test(userAgent)) return 'Windows';
	if (/android/i.test(userAgent)) return 'Android';
	if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS / iPadOS';
	if (/mac os x|macintosh/i.test(userAgent)) return 'macOS';
	if (/linux/i.test(userAgent)) return 'Linux';
	return 'Other';
}

export function botSignalFromUserAgent(userAgent: string) {
	if (/googlebot|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|crawler|spider|bot/i.test(userAgent)) {
		return 'Likely bot/crawler';
	}

	return 'Likely human';
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

export function sourceGroup(referrer: string) {
	if (!referrer) return 'Direct';

	try {
		const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
		if (host.includes('nuc7.com')) return 'Internal';
		if (/(google|bing|duckduckgo|yahoo|baidu|yandex|ecosia|naver)\./i.test(host)) return 'Search';
		if (/(facebook|instagram|threads|x\.com|twitter|linkedin|pinterest|reddit|youtube|tiktok)\./i.test(host)) return 'Social';
		if (/(chatgpt|openai|perplexity|copilot|gemini|claude|poe)\./i.test(host)) return 'AI answer engines';
		return 'Referral';
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
			`nuc7_vid=${finalVisitorId}; Path=/; HttpOnly; Max-Age=31536000; SameSite=Lax; Secure`,
			`nuc7_last=${date}; Path=/; HttpOnly; Max-Age=172800; SameSite=Lax; Secure`,
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
