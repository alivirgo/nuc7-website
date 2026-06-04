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

	const stateData = await readState(request, state, env);
	if (!stateData) {
		return unauthorizedPage('Invalid or expired sign-in state.', 400);
	}

	try {
		const accessToken = await exchangeGithubCodeForToken(code, env);
		const email = await verifyOwnerGithubEmail(accessToken, env);
		const sessionCookie = await createSessionCookie(email, env);
		const clearedStateCookie = clearStateCookie();

		if (stateData.mode === 'decap') {
			const content = {
				token: accessToken,
				provider: 'github',
			};
			const script = `<!doctype html>
<html>
	<body>
		<script>
			const receiveMessage = (message) => {
				window.opener.postMessage(
					'authorization:${content.provider}:success:${JSON.stringify(content)}',
					message.origin
				);
				window.removeEventListener('message', receiveMessage, false);
				window.close();
			};

			window.addEventListener('message', receiveMessage, false);
			window.opener.postMessage('authorizing:${content.provider}', '*');
		</script>
	</body>
</html>`;

			const headers = new Headers({
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-store',
			});
			headers.append('Set-Cookie', sessionCookie);
			headers.append('Set-Cookie', clearedStateCookie);
			return new Response(script, { headers });
		}

		const headers = new Headers({
			Location: stateData.nextPath,
			'Cache-Control': 'no-store',
		});
		headers.append('Set-Cookie', sessionCookie);
		headers.append('Set-Cookie', clearedStateCookie);

		return new Response(null, { status: 302, headers });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Sign-in failed.';
		return unauthorizedPage(message);
	}
};
