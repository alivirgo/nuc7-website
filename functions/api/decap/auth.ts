import { createStateCookie, type AuthEnv } from '../../_auth';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
	if (!env.GITHUB_CLIENT_ID) {
		return new Response('Missing GITHUB_CLIENT_ID for Decap CMS OAuth.', { status: 500 });
	}

	const url = new URL(request.url);
	const { state, cookie } = await createStateCookie('/admin/', env, 'decap');
	const redirectUri = new URL('/api/auth/callback', url.origin).toString();
	const params = new URLSearchParams({
		client_id: env.GITHUB_CLIENT_ID,
		scope: 'repo read:user user:email',
		state,
		redirect_uri: redirectUri,
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
			'Set-Cookie': cookie,
			'Cache-Control': 'no-store',
		},
	});
};
