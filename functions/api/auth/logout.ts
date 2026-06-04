import { clearSessionCookie, clearStateCookie } from '../../_auth';

export const onRequestGet: PagesFunction = async ({ request }) => {
	const url = new URL(request.url);
	const nextPath = url.searchParams.get('next') || '/';

	const headers = new Headers({
		Location: nextPath,
		'Cache-Control': 'no-store',
	});
	headers.append('Set-Cookie', clearSessionCookie());
	headers.append('Set-Cookie', clearStateCookie());

	return new Response(null, {
		status: 302,
		headers,
	});
};
