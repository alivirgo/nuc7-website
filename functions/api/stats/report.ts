import type { DailyStats, Env } from './_shared';
import { requireAdminSession } from '../../_auth';
import { requireStatsToken, topEntries } from './_shared';

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
	};

	for (const day of days) {
		totals.views += day.pageViews;
		totals.visitors += day.visitors;

		for (const [key, value] of Object.entries(day.pages)) totals.pages[key] = (totals.pages[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.referrers)) totals.referrers[key] = (totals.referrers[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.countries)) totals.countries[key] = (totals.countries[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.devices)) totals.devices[key] = (totals.devices[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.browsers)) totals.browsers[key] = (totals.browsers[key] ?? 0) + value;
		for (const [key, value] of Object.entries(day.events)) totals.events[key] = (totals.events[key] ?? 0) + value;
	}

	return totals;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	if (!env.NUC7_STATS) {
		return Response.json({ error: 'Missing NUC7_STATS binding.' }, { status: 500 });
	}

	const sessionEmail = await requireAdminSession(request, env);
	if (!sessionEmail) {
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

	const validDays = daily.filter(Boolean) as DailyStats[];
	const totals = aggregateDays(validDays);

	return Response.json({
		summary: {
			views: totals.views,
			visitors: totals.visitors,
			daysTracked: validDays.length,
			averageViewsPerDay: validDays.length ? Math.round(totals.views / validDays.length) : 0,
		},
		series: validDays.map((day) => ({
			date: day.date,
			views: day.pageViews,
			visitors: day.visitors,
		})),
		topPages: topEntries(totals.pages),
		topReferrers: topEntries(totals.referrers),
		topCountries: topEntries(totals.countries),
		topDevices: topEntries(totals.devices),
		topBrowsers: topEntries(totals.browsers),
		topEvents: topEntries(totals.events),
	});
};
