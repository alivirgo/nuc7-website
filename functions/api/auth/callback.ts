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
			const authMessage = `authorization:${content.provider}:success:${JSON.stringify(content)}`;
			const adminPath = stateData.nextPath || '/admin/';
			const script = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>NUC7 CMS sign-in</title>
		<style>
			:root {
				color-scheme: light;
				font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			}

			body {
				align-items: center;
				background: #f4f7fb;
				color: #1b2a33;
				display: flex;
				min-height: 100vh;
				justify-content: center;
				margin: 0;
				padding: 24px;
			}

			main {
				background: #ffffff;
				border: 1px solid #dbe5ef;
				border-radius: 8px;
				box-shadow: 0 18px 48px rgba(25, 42, 54, 0.12);
				max-width: 460px;
				padding: 28px;
			}

			h1 {
				font-size: 22px;
				line-height: 1.2;
				margin: 0 0 12px;
			}

			p {
				font-size: 15px;
				line-height: 1.6;
				margin: 0 0 14px;
			}

			a {
				color: #0c6bbf;
				font-weight: 700;
			}
		</style>
	</head>
	<body>
		<main>
			<h1>Completing CMS sign-in</h1>
			<p id="status">Sending GitHub authorization back to the NUC7 admin...</p>
			<p>If this page does not move automatically, <a href="${adminPath}">return to admin</a> and click Login with GitHub once more.</p>
		</main>
		<script>
			const authMessage = ${JSON.stringify(authMessage)};
			const adminPath = ${JSON.stringify(adminPath)};
			const status = document.getElementById('status');

			function finishInCurrentTab() {
				try {
					localStorage.setItem('nuc7_decap_authorization', authMessage);
					localStorage.setItem('nuc7_decap_authorization_created_at', String(Date.now()));
					status.textContent = 'Returning to the NUC7 admin...';
					window.setTimeout(() => window.location.replace(adminPath), 650);
				} catch (error) {
					status.textContent = 'Authorization succeeded. Return to admin and try the CMS login again.';
				}
			}

			function sendToPopupOpener() {
				if (!window.opener || window.opener.closed) {
					return false;
				}

				let completed = false;
				const receiveMessage = (message) => {
					completed = true;
					window.opener.postMessage(authMessage, message.origin || window.location.origin);
					window.removeEventListener('message', receiveMessage, false);
					status.textContent = 'Authorization sent. Closing this window...';
					window.setTimeout(() => window.close(), 120);
				};

				window.addEventListener('message', receiveMessage, false);
				window.opener.postMessage('authorizing:${content.provider}', '*');

				window.setTimeout(() => {
					if (!completed) {
						window.removeEventListener('message', receiveMessage, false);
						finishInCurrentTab();
					}
				}, 2500);

				return true;
			}

			if (!sendToPopupOpener()) {
				finishInCurrentTab();
			}
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
