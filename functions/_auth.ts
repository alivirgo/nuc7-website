const SESSION_COOKIE = 'nuc7_admin_session';
const STATE_COOKIE = 'nuc7_admin_state';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_OWNER_EMAIL = 'alivirgo123@live.com';

export interface AuthEnv {
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	GITHUB_REPO_ID?: string;
	OWNER_GITHUB_EMAIL?: string;
	SESSION_SECRET?: string;
}

interface SessionPayload {
	email: string;
	exp: number;
}

interface StatePayload {
	mode: 'admin' | 'decap';
	nextPath: string;
	exp: number;
}

function base64UrlEncode(input: string) {
	return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input: string) {
	const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
	return atob(padded);
}

async function importSigningKey(secret: string) {
	return crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify'],
	);
}

async function signValue(value: string, secret: string) {
	const key = await importSigningKey(secret);
	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
	const bytes = new Uint8Array(signature);
	const raw = String.fromCharCode(...bytes);
	return base64UrlEncode(raw);
}

async function verifySignedValue(value: string, signature: string, secret: string) {
	const expected = await signValue(value, secret);
	return expected === signature;
}

function ownerEmail(env: AuthEnv) {
	return (env.OWNER_GITHUB_EMAIL || DEFAULT_OWNER_EMAIL).trim().toLowerCase();
}

export function parseCookies(header: string | null) {
	return (header ?? '')
		.split(';')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.reduce<Record<string, string>>((cookies, entry) => {
			const [key, ...value] = entry.split('=');
			cookies[key] = value.join('=');
			return cookies;
		}, {});
}

export function clearSessionCookie() {
	return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

export function clearStateCookie() {
	return `${STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

export async function createSessionCookie(email: string, env: AuthEnv) {
	if (!env.SESSION_SECRET) {
		throw new Error('Missing SESSION_SECRET.');
	}

	const payload: SessionPayload = {
		email: email.trim().toLowerCase(),
		exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
	};
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	const signature = await signValue(encodedPayload, env.SESSION_SECRET);
	return `${SESSION_COOKIE}=${encodedPayload}.${signature}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${SESSION_MAX_AGE}`;
}

export async function getSessionEmail(request: Request, env: AuthEnv) {
	if (!env.SESSION_SECRET) {
		return null;
	}

	const cookies = parseCookies(request.headers.get('cookie'));
	const raw = cookies[SESSION_COOKIE];
	if (!raw) {
		return null;
	}

	const [encodedPayload, signature] = raw.split('.');
	if (!encodedPayload || !signature) {
		return null;
	}

	const isValid = await verifySignedValue(encodedPayload, signature, env.SESSION_SECRET);
	if (!isValid) {
		return null;
	}

	const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
	if (!payload.email || !payload.exp) {
		return null;
	}

	if (payload.exp < Math.floor(Date.now() / 1000)) {
		return null;
	}

	return payload.email;
}

export async function requireAdminSession(request: Request, env: AuthEnv) {
	const email = await getSessionEmail(request, env);
	return email && email === ownerEmail(env) ? email : null;
}

export async function createStateCookie(nextPath: string, env: AuthEnv, mode: 'admin' | 'decap' = 'admin') {
	if (!env.SESSION_SECRET) {
		throw new Error('Missing SESSION_SECRET.');
	}

	const statePayload: StatePayload = {
		mode,
		nextPath,
		exp: Math.floor(Date.now() / 1000) + 600,
	};
	const encoded = base64UrlEncode(JSON.stringify(statePayload));
	const signature = await signValue(encoded, env.SESSION_SECRET);
	return {
		state: `${encoded}.${signature}`,
		cookie: `${STATE_COOKIE}=${encoded}.${signature}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`,
	};
}

export async function readState(request: Request, state: string | null, env: AuthEnv) {
	if (!env.SESSION_SECRET || !state) {
		return null;
	}

	const cookies = parseCookies(request.headers.get('cookie'));
	if (cookies[STATE_COOKIE] !== state) {
		return null;
	}

	const [encoded, signature] = state.split('.');
	if (!encoded || !signature) {
		return null;
	}

	const isValid = await verifySignedValue(encoded, signature, env.SESSION_SECRET);
	if (!isValid) {
		return null;
	}

	const payload = JSON.parse(base64UrlDecode(encoded)) as Partial<StatePayload>;
	if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
		return null;
	}

	return {
		mode: payload.mode === 'decap' ? 'decap' : 'admin',
		nextPath: payload.nextPath || '/admin/',
	};
}

export async function exchangeGithubCodeForToken(code: string, env: AuthEnv) {
	if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
		throw new Error('Missing GitHub OAuth environment variables.');
	}

	const payload = {
		code,
		client_id: env.GITHUB_CLIENT_ID,
		client_secret: env.GITHUB_CLIENT_SECRET,
		...(env.GITHUB_REPO_ID ? { repository_id: env.GITHUB_REPO_ID } : {}),
	};

	const response = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`GitHub OAuth exchange failed with status ${response.status}.`);
	}

	const body = (await response.json()) as {
		access_token?: string;
		error?: string;
		error_description?: string;
	};

	if (body.error || !body.access_token) {
		throw new Error(body.error_description ?? body.error ?? 'No access token returned from GitHub.');
	}

	return body.access_token;
}

export async function verifyOwnerGithubEmail(accessToken: string, env: AuthEnv) {
	const response = await fetch('https://api.github.com/user/emails', {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${accessToken}`,
			'User-Agent': 'nuc7-website-auth',
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub email lookup failed with status ${response.status}.`);
	}

	const emails = (await response.json()) as Array<{
		email?: string;
		primary?: boolean;
		verified?: boolean;
	}>;

	const allowed = ownerEmail(env);
	const match = emails.find((entry) => entry.email?.toLowerCase() === allowed && entry.verified);
	if (!match) {
		throw new Error(`Only the GitHub account for ${allowed} can access this area.`);
	}

	return allowed;
}

export function unauthorizedPage(message: string, status = 403) {
	return new Response(
		`<!doctype html><html><body><p>${message}</p><p><a href="/api/auth/login?next=/admin/">Sign in with GitHub</a></p></body></html>`,
		{
			status,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		},
	);
}
