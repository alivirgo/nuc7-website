import type { AuthEnv } from '../../_auth';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ env }) => {
	if (!env.GITHUB_CLIENT_ID) {
		return new Response('Missing GITHUB_CLIENT_ID for Decap CMS OAuth.', { status: 500 });
	}

	const params = new URLSearchParams({
		client_id: env.GITHUB_CLIENT_ID,
		scope: 'repo read:user user:email',
	});

	return Response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302);
};
