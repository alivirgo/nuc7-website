const SECURITY_HEADERS: Record<string, string> = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': [
		'accelerometer=()',
		'autoplay=()',
		'camera=()',
		'clipboard-read=()',
		'clipboard-write=(self)',
		'display-capture=()',
		'encrypted-media=()',
		'fullscreen=(self)',
		'geolocation=()',
		'gyroscope=()',
		'magnetometer=()',
		'microphone=()',
		'midi=()',
		'payment=()',
		'picture-in-picture=()',
		'usb=()',
	].join(', '),
};

const PUBLIC_CSP = [
	"default-src 'self'",
	"base-uri 'self'",
	"connect-src 'self'",
	"font-src 'self' data:",
	"form-action 'self' https://github.com",
	"frame-ancestors 'none'",
	"img-src 'self' data: https:",
	"object-src 'none'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	'upgrade-insecure-requests',
].join('; ');

const ADMIN_CSP = [
	"default-src 'self'",
	"base-uri 'self'",
	"connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com",
	"font-src 'self' data:",
	"form-action 'self' https://github.com",
	"frame-ancestors 'none'",
	"img-src 'self' data: https:",
	"object-src 'none'",
	"script-src 'self' 'unsafe-inline' https://unpkg.com",
	"style-src 'self' 'unsafe-inline'",
	'upgrade-insecure-requests',
].join('; ');

function isAdminSurface(pathname: string) {
	return pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/auth/');
}

export function addSecurityHeaders(response: Response, request: Request) {
	const url = new URL(request.url);
	const secured = new Response(response.body, response);

	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		secured.headers.set(name, value);
	}

	secured.headers.set('Content-Security-Policy', isAdminSurface(url.pathname) ? ADMIN_CSP : PUBLIC_CSP);

	if (url.pathname === '/admin' || url.pathname.startsWith('/admin/') || url.pathname === '/site-stats') {
		secured.headers.set('Cache-Control', 'no-store');
	}

	return secured;
}
