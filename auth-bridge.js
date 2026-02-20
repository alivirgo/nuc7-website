export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // 0. HEALTH CHECK (No Dependencies)
            if (path === '/ping') {
                return new Response(JSON.stringify({ status: 'online', timestamp: new Date().toISOString() }), {
                    headers: corsHeaders
                });
            }

            // 1. PRODUCTION VISITOR TRACKING (STRICT KV)
            if (path === '/track' && request.method === 'POST') {
                const hitData = await request.json();

                if (!env.NUC7_STATS) {
                    return new Response(JSON.stringify({ error: 'KV Namespace NUC7_STATS not found.' }), {
                        status: 500, headers: corsHeaders
                    });
                }

                const timestamp = new Date().toISOString();
                const hit = {
                    path: hitData.path,
                    referrer: hitData.referrer || 'Direct',
                    userAgent: hitData.userAgent || 'Unknown',
                    timestamp
                };

                // Update Recent Hits (Limited to 50)
                let hits = await env.NUC7_STATS.get('hits', 'json') || [];
                hits.unshift(hit);
                if (hits.length > 50) hits.pop();
                await env.NUC7_STATS.put('hits', JSON.stringify(hits));

                // Increment Total Views
                const totalViews = (parseInt(await env.NUC7_STATS.get('totalViews')) || 0) + 1;
                await env.NUC7_STATS.put('totalViews', totalViews.toString());

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // 2. ACTUAL ADMIN STATS (NO DUMMY DATA)
            if (path === '/stats' && request.method === 'POST') {
                const { password } = await request.json();

                // Auth Check
                const vaultRes = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/vault.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });

                if (!vaultRes.ok) {
                    const errText = await vaultRes.text();
                    throw new Error(`Vault Access Failed: ${vaultRes.status} ${errText}`);
                }

                const vault = await vaultRes.json();
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
                const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

                if (hashHex !== vault.adminPasswordHash) {
                    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
                }

                if (!env.NUC7_STATS) {
                    return new Response(JSON.stringify({ error: 'NUC7_STATS KV missing.' }), { status: 500, headers: corsHeaders });
                }

                const hits = await env.NUC7_STATS.get('hits', 'json') || [];
                const totalViews = await env.NUC7_STATS.get('totalViews') || '0';
                const registrations = await env.NUC7_STATS.get('totalReg') || '0';

                return new Response(JSON.stringify({
                    activeUsers: Math.max(1, Math.floor(hits.length / 4)), // Estimated live
                    pageViews: totalViews,
                    totalRegistrations: registrations,
                    hits: hits
                }), { headers: corsHeaders });
            }

            // 3. SECURE EMAIL REGISTRATION
            if (path === '/send-registration' && request.method === 'POST') {
                const { email } = await request.json();

                // 1. Generate Signed Token
                const salt = env.AUTH_SECRET || 'nuc7_prod_secret';
                const tokenSource = `${email}:${Date.now()}:${salt}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                const token = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                // 2. Log Registration Stats
                if (env.NUC7_STATS) {
                    const totalReg = (parseInt(await env.NUC7_STATS.get('totalReg')) || 0) + 1;
                    await env.NUC7_STATS.put('totalReg', totalReg.toString());
                }

                // 3. INTEGRATION: SEND EMAIL (SENDGRID)
                // Note to User: Set env.SENDGRID_API_KEY in Cloudflare dashboard
                if (env.SENDGRID_API_KEY) {
                    const quizUrl = `${url.origin}/quiz.html?email=${encodeURIComponent(email)}&token=${token}`;
                    await fetch('https://api.sendgrid.com/v3/mail/send', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            personalizations: [{ to: [{ email }] }],
                            from: { email: 'noreply@nuc7.com', name: 'NUC7 Course Team' },
                            subject: 'Your NUC7 Qualification Quiz Link',
                            content: [{ type: 'text/html', value: `<p>Start your Networking journey: <a href="${quizUrl}">Begin Qualification Test</a></p>` }]
                        })
                    });
                }

                return new Response(JSON.stringify({ success: true, message: 'Registry complete. Check email.' }), { headers: corsHeaders });
            }

            // 4. SECURE QUESTION FETCH
            if (path === '/get-questions' && request.method === 'GET') {
                const res = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/questions.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });
                const allQuestions = await res.json();
                // Shuffle 10 questions for production
                const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
                return new Response(JSON.stringify(shuffled), { headers: corsHeaders });
            }

            return new Response('NUC7 Bridge: Path Not Found', { status: 404, headers: corsHeaders });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
    }
};
