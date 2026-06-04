import { requireAdminSession } from './_auth';

interface Env {
	OWNER_GITHUB_EMAIL?: string;
	SESSION_SECRET?: string;
}

function shouldProtect(pathname: string) {
	return (
		pathname === '/admin' ||
		pathname.startsWith('/admin/') ||
		pathname === '/site-stats' ||
		pathname.startsWith('/site-stats/') ||
		pathname === '/api/stats/report'
	);
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const { request, env, next } = context;
	const url = new URL(request.url);

	if (!shouldProtect(url.pathname)) {
		return next();
	}

	const email = await requireAdminSession(request, env);
	if (email) {
		return next();
	}

	if (url.pathname === '/api/stats/report') {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const nextPath = `${url.pathname}${url.search}`;
	return Response.redirect(new URL(`/api/auth/login?next=${encodeURIComponent(nextPath)}`, url.origin), 302);
};
