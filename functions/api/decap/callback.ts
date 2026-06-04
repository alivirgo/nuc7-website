import {
	clearStateCookie,
	type AuthEnv,
} from '../../_auth';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
	const url = new URL(request.url);
	const callbackUrl = new URL('/api/auth/callback', url.origin);
	callbackUrl.search = url.search;

	const headers = new Headers({
		Location: callbackUrl.toString(),
		'Cache-Control': 'no-store',
	});
	headers.append('Set-Cookie', clearStateCookie());

	return new Response(null, {
		status: 302,
		headers,
	});
};
