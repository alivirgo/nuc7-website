import {
	createSessionCookie,
	exchangeGithubCodeForToken,
	type AuthEnv,
	verifyOwnerGithubEmail,
} from '../../_auth';

function errorResponse(message: string) {
	return new Response(
		`<html><body><p>${message}</p><script>window.close();</script></body></html>`,
		{
			status: 500,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		},
	);
}

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return errorResponse('Missing GitHub authorization code.');
	}

	try {
		const accessToken = await exchangeGithubCodeForToken(code, env);
		const email = await verifyOwnerGithubEmail(accessToken, env);
		const sessionCookie = await createSessionCookie(email, env);
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

		return new Response(script, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-store',
				'Set-Cookie': sessionCookie,
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'GitHub sign-in failed.';
		return errorResponse(message);
	}
};
