import {
	clearStateCookie,
	createSessionCookie,
	exchangeGithubCodeForToken,
	readState,
	type AuthEnv,
	unauthorizedPage,
	verifyOwnerGithubEmail,
} from '../../_auth';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		return unauthorizedPage('Missing GitHub authorization code.', 400);
	}

	const nextPath = await readState(request, state, env);
	if (!nextPath) {
		return unauthorizedPage('Invalid or expired sign-in state.', 400);
	}

	try {
		const accessToken = await exchangeGithubCodeForToken(code, env);
		const email = await verifyOwnerGithubEmail(accessToken, env);
		const sessionCookie = await createSessionCookie(email, env);
		const headers = new Headers({
			Location: nextPath,
			'Cache-Control': 'no-store',
		});
		headers.append('Set-Cookie', sessionCookie);
		headers.append('Set-Cookie', clearStateCookie());

		return new Response(null, {
			status: 302,
			headers,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Sign-in failed.';
		return unauthorizedPage(message);
	}
};
