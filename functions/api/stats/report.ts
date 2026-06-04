import type { DailyStats, Env } from './_shared';
import { requireAdminSession } from '../../_auth';
import { ensureDailyShape, requireStatsToken, topEntries, unauthorizedResponse } from './_shared';

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function aggregateDays(days: DailyStats[]) {
	const totals = {
		views: 0,
		visitors: 0,
		pages: {} as Record<string, number>,
		referrers: {} as Record<string, number>,
		countries: {} as Record<string, number>,
		devices: {} as Record<string, number>,
		browsers: {} as Record<string, number>,
		events: {} as Record<string, number>,
		landingPages: {} as Record<string, number>,
		pageCategories: {} as Record<string, number>,
		searchTerms: {} as Record<string, number>,
		searchEngines: {} as Record<string, number>,
		socialSources: {} as Record<string, number>,
		trafficSources: {} as Record<string, number>,
		utmSources: {} as Record<string, number>,
		utmMediums: {} as Record<string, number>,
		utmCampaigns: {} as Record<string, number>,
		utmContents: {} as Record<string, number>,
		utmTerms: {} as Record<string, number>,
		languages: {} as Record<string, number>,
		timezones: {} as Record<string, number>,
		colo: {} as Record<string, number>,
		hours: {} as Record<string, number>,
		weekdays: {} as Record<string, number>,
		viewportSizes: {} as Record<string, number>,
		screenSizes: {} as Record<string, number>,
		colorSchemes: {} as Record<string, number>,
		connectionTypes: {} as Record<string, number>,
		operatingSystems: {} as Record<string, number>,
		botSignals: {} as Record<string, number>,
		eventLabels: {} as Record<string, number>,
		sessionDepths: {} as Record<string, number>,
		sessionAgeBuckets: {} as Record<string, number>,
		visitorAgeBuckets: {} as Record<string, number>,
		visitCounts: {} as Record<string, number>,
		recentActivity: [] as NonNullable<DailyStats['recentActivity']>,
		returningVisitors: 0,
		sessions: 0,
		returningSessions: 0,
	};

	for (const rawDay of days) {
		const day = ensureDailyShape(rawDay);
		totals.views += day.pageViews;
		totals.visitors += day.visitors;
		totals.returningVisitors += day.returningVisitors ?? 0;
		totals.sessions += day.sessions ?? 0;
		totals.returningSessions += day.returningSessions ?? 0;

		for (const [key, value] of Object.entries(day.pages)) totals.pages[key] = (totals.pages[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.referrers)) totals.referrers[key] = (totals.referrers[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.countries)) totals.countries[key] = (totals.countries[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.devices)) totals.devices[key] = (totals.devices[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.browsers)) totals.browsers[key] = (totals.browsers[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.events)) totals.events[key] = (totals.events[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.landingPages ?? {})) totals.landingPages[key] = (totals.landingPages[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.pageCategories ?? {})) totals.pageCategories[key] = (totals.pageCategories[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.searchTerms ?? {})) totals.searchTerms[key] = (totals.searchTerms[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.searchEngines ?? {})) totals.searchEngines[key] = (totals.searchEngines[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.socialSources ?? {})) totals.socialSources[key] = (totals.socialSources[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.trafficSources ?? {})) totals.trafficSources[key] = (totals.trafficSources[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.utmSources ?? {})) totals.utmSources[key] = (totals.utmSources[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.utmMediums ?? {})) totals.utmMediums[key] = (totals.utmMediums[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.utmCampaigns ?? {})) totals.utmCampaigns[key] = (totals.utmCampaigns[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.utmContents ?? {})) totals.utmContents[key] = (totals.utmContents[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.utmTerms ?? {})) totals.utmTerms[key] = (totals.utmTerms[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.languages ?? {})) totals.languages[key] = (totals.languages[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.timezones ?? {})) totals.timezones[key] = (totals.timezones[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.colo ?? {})) totals.colo[key] = (totals.colo[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.hours ?? {})) totals.hours[key] = (totals.hours[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.weekdays ?? {})) totals.weekdays[key] = (totals.weekdays[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.viewportSizes ?? {})) totals.viewportSizes[key] = (totals.viewportSizes[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.screenSizes ?? {})) totals.screenSizes[key] = (totals.screenSizes[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.colorSchemes ?? {})) totals.colorSchemes[key] = (totals.colorSchemes[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.connectionTypes ?? {})) totals.connectionTypes[key] = (totals.connectionTypes[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.operatingSystems ?? {})) totals.operatingSystems[key] = (totals.operatingSystems[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.botSignals ?? {})) totals.botSignals[key] = (totals.botSignals[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.eventLabels ?? {})) totals.eventLabels[key] = (totals.eventLabels[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.sessionDepths ?? {})) totals.sessionDepths[key] = (totals.sessionDepths[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.sessionAgeBuckets ?? {})) totals.sessionAgeBuckets[key] = (totals.sessionAgeBuckets[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.visitorAgeBuckets ?? {})) totals.visitorAgeBuckets[key] = (totals.visitorAgeBuckets[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.visitCounts ?? {})) totals.visitCounts[key] = (totals.visitCounts[key] ?? 0) + value;
		totals.recentActivity.push(...(day.recentActivity ?? []));
	}

	return totals;
}

function percent(part: number, total: number) {
	return total ? Math.round((part / total) * 1000) / 10 : 0;
}

function conversionRows(events: Record<string, number>, views: number) {
	return topEntries(events, 20).map((entry) => ({
		...entry,
		rate: percent(entry.count, views),
	}));
}

function strongest(record: Record<string, number>) {
	return topEntries(record, 1)[0] ?? null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	if (!env.NUC7_STATS) {
		return Response.json({ error: 'Missing NUC7_STATS binding.' }, { status: 500 });
	}

	const sessionEmail = await requireAdminSession(request, env);
	if (!sessionEmail) {
		if (!env.SITE_STATS_TOKEN) return unauthorizedResponse();
		const authError = requireStatsToken(request, env);
		if (authError) return authError;
	}

	const url = new URL(request.url);
	const daysRequested = clamp(Number(url.searchParams.get('days') ?? '30') || 30, 1, 120);
	const prefix = 'stats:daily:';
	const listed = await env.NUC7_STATS.list({ prefix, limit: 200 });
	const dates = listed.keys
		.map((entry) => entry.name.slice(prefix.length))
		.sort()
		.slice(-daysRequested);

	const daily = await Promise.all(
		dates.map(async (date) => {
			const data = await env.NUC7_STATS.get<DailyStats>(`${prefix}${date}`, 'json');
			return data;
		}),
	);

	const validDays = daily.filter(Boolean).map((day) => ensureDailyShape(day as DailyStats));
	const totals = aggregateDays(validDays);
	const topPage = strongest(totals.pages);
	const topReferrer = strongest(totals.referrers);
	const topCountry = strongest(totals.countries);
	const topTrafficSource = strongest(totals.trafficSources);
	const searchViews = totals.trafficSources.Search ?? 0;
	const aiViews = totals.trafficSources['AI answer engines'] ?? 0;

	return Response.json({
		summary: {
			views: totals.views,
			visitors: totals.visitors,
			returningVisitors: totals.returningVisitors,
			visitorReturnRate: percent(totals.returningVisitors, totals.views),
			sessions: totals.sessions,
			returningSessions: totals.returningSessions,
			sessionReturnRate: percent(totals.returningSessions, totals.sessions),
			events: Object.values(totals.events).reduce((sum, value) => sum + value, 0),
			clickRate: percent(Object.values(totals.events).reduce((sum, value) => sum + value, 0), totals.views),
			daysTracked: validDays.length,
			averageViewsPerDay: validDays.length ? Math.round(totals.views / validDays.length) : 0,
			topPage: topPage?.label ?? 'None yet',
			topReferrer: topReferrer?.label ?? 'None yet',
			topCountry: topCountry?.label ?? 'None yet',
			topTrafficSource: topTrafficSource?.label ?? 'None yet',
			searchShare: percent(searchViews, totals.views),
			aiAnswerShare: percent(aiViews, totals.views),
		},
		series: validDays.map((day) => ({
			date: day.date,
			views: day.pageViews,
			visitors: day.visitors,
			returningVisitors: day.returningVisitors ?? 0,
			events: Object.values(day.events).reduce((sum, value) => sum + value, 0),
		})),
		topPages: topEntries(totals.pages, 25),
		topLandingPages: topEntries(totals.landingPages, 25),
		topPageCategories: topEntries(totals.pageCategories, 20),
		topReferrers: topEntries(totals.referrers, 25),
		topTrafficSources: topEntries(totals.trafficSources, 20),
		topSearchTerms: topEntries(totals.searchTerms, 25),
		topSearchEngines: topEntries(totals.searchEngines, 10),
		topSocialSources: topEntries(totals.socialSources, 10),
		topCountries: topEntries(totals.countries, 25),
		topLanguages: topEntries(totals.languages, 20),
		topTimezones: topEntries(totals.timezones, 20),
		topColo: topEntries(totals.colo, 20),
		topDevices: topEntries(totals.devices, 10),
		topBrowsers: topEntries(totals.browsers, 15),
		topOperatingSystems: topEntries(totals.operatingSystems, 15),
		topViewportSizes: topEntries(totals.viewportSizes, 15),
		topScreenSizes: topEntries(totals.screenSizes, 15),
		topColorSchemes: topEntries(totals.colorSchemes, 10),
		topConnectionTypes: topEntries(totals.connectionTypes, 10),
		topBotSignals: topEntries(totals.botSignals, 10),
		topSessionDepths: topEntries(totals.sessionDepths, 10),
		topSessionAgeBuckets: topEntries(totals.sessionAgeBuckets, 10),
		topVisitorAgeBuckets: topEntries(totals.visitorAgeBuckets, 10),
		topVisitCounts: topEntries(totals.visitCounts, 10),
		topEvents: topEntries(totals.events, 25),
		topEventLabels: topEntries(totals.eventLabels, 25),
		topUtmSources: topEntries(totals.utmSources, 25),
		topUtmMediums: topEntries(totals.utmMediums, 25),
		topUtmCampaigns: topEntries(totals.utmCampaigns, 25),
		topUtmContents: topEntries(totals.utmContents, 25),
		topUtmTerms: topEntries(totals.utmTerms, 25),
		hourly: topEntries(totals.hours, 24).sort((a, b) => a.label.localeCompare(b.label)),
		weekdays: topEntries(totals.weekdays, 7),
		conversions: conversionRows(totals.events, totals.views),
		recentActivity: totals.recentActivity
			.sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
			.slice(0, 50),
		insights: [
			`Top page: ${topPage?.label ?? 'not enough data yet'}.`,
			`Primary source: ${topTrafficSource?.label ?? 'not enough data yet'}.`,
			`Search share: ${percent(searchViews, totals.views)}%.`,
			`AI answer-engine share: ${percent(aiViews, totals.views)}%.`,
			`Best country: ${topCountry?.label ?? 'not enough data yet'}.`,
			`Top referrer: ${topReferrer?.label ?? 'not enough data yet'}.`,
		],
	});
};
