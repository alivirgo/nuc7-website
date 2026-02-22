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

        // Resolve KV Namespace (Flexible for user's KV_BINDING or NUC7_STATS)
        const STATS_KV = env.NUC7_STATS || env.KV_BINDING;

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

                if (!STATS_KV) {
                    return new Response(JSON.stringify({ error: 'NUC7 Statistics KV Not Found. Visit your Cloudflare dashboard to bind it.' }), {
                        status: 500, headers: corsHeaders
                    });
                }

                const timestamp = new Date().toISOString();
                const cf = request.cf || {};
                const ip = request.headers.get('cf-connecting-ip') || 'Unknown';

                const hit = {
                    path: hitData.path,
                    referrer: hitData.referrer || 'Direct',
                    userAgent: hitData.userAgent || 'Unknown',
                    ip: ip,
                    city: cf.city || 'Unknown',
                    country: cf.country || 'Unknown',
                    isp: cf.asOrganization || 'Unknown',
                    datacenter: cf.colo || 'Unknown',
                    protocol: cf.httpProtocol || 'Unknown',
                    timestamp
                };

                // Update Recent Hits (Limited to 50)
                let hits = await STATS_KV.get('hits', 'json') || [];
                hits.unshift(hit);
                if (hits.length > 50) hits.pop();
                await STATS_KV.put('hits', JSON.stringify(hits));

                // Increment Total Views
                const totalViews = (parseInt(await STATS_KV.get('totalViews')) || 0) + 1;
                await STATS_KV.put('totalViews', totalViews.toString());

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

                if (!STATS_KV) {
                    return new Response(JSON.stringify({ error: 'NUC7_STATS/KV_BINDING KV missing.' }), { status: 500, headers: corsHeaders });
                }

                const hits = await STATS_KV.get('hits', 'json') || [];
                const totalViews = await STATS_KV.get('totalViews') || '0';
                const registrations = await STATS_KV.get('totalReg') || '0';

                // Fetch Student List
                const list = await STATS_KV.list({ prefix: 'user:' });
                const students = [];
                for (const key of list.keys) {
                    const u = await STATS_KV.get(key.name, 'json');
                    if (u) students.push(u);
                }

                return new Response(JSON.stringify({
                    activeUsers: Math.max(1, Math.floor(hits.length / 4)), // Estimated live
                    pageViews: totalViews,
                    totalRegistrations: registrations,
                    hits: hits,
                    students: students
                }), { headers: corsHeaders });
            }

            // 2.1 CLEAR STATS (Admin Only)
            if (path === '/clear-stats' && request.method === 'POST') {
                const { password } = await request.json();

                // Auth Check (Same as stats)
                const vaultRes = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/vault.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });
                const vault = await vaultRes.json();
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
                const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

                if (hashHex !== vault.adminPasswordHash) {
                    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
                }

                if (STATS_KV) {
                    await STATS_KV.delete('hits');
                    await STATS_KV.put('totalViews', '0');
                }

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // 3. SECURE EMAIL REGISTRATION
            if (path === '/send-registration' && request.method === 'POST') {
                const { name, email } = await request.json();
                const ip = request.headers.get('cf-connecting-ip') || 'Unknown';
                const cf = request.cf || {};

                // 1. Generate Signed Token
                const salt = env.AUTH_SECRET;
                if (!salt) throw new Error("AUTH_SECRET environment variable is required.");
                const tokenSource = `${email}:${Date.now()}:${salt}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                const token = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                // 2. Log Registration Stats & Create Profile
                if (STATS_KV) {
                    const userData = {
                        name: name || 'Anonymous',
                        email,
                        ip,
                        location: `${cf.city || '?'}, ${cf.country || '?'}`,
                        isp: cf.asOrganization || 'Unknown',
                        registeredAt: new Date().toISOString(),
                        progress: { score: 0, chapters: [] }
                    };
                    await STATS_KV.put(`user:${email}`, JSON.stringify(userData));

                    const totalReg = (parseInt(await STATS_KV.get('totalReg')) || 0) + 1;
                    await STATS_KV.put('totalReg', totalReg.toString());
                }

                // 3. INTEGRATION: SEND EMAIL (SENDGRID)
                const { courseId } = await request.json().catch(() => ({}));
                if (env.SENDGRID_API_KEY) {
                    const frontendUrl = env.FRONTEND_URL || url.origin;
                    const quizUrl = `${frontendUrl}/quiz.html?email=${encodeURIComponent(email)}&token=${token}${courseId ? `&course=${courseId}` : ''}`;
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

            // 3.5 GET PRODUCTION TOKEN (After Quiz Success)
            if (path === '/get-token' && request.method === 'POST') {
                const { email, score, courseId } = await request.json();

                if (score < 7) {
                    return new Response(JSON.stringify({ error: 'Score too low.' }), { status: 403, headers: corsHeaders });
                }

                const salt = env.AUTH_SECRET;
                if (!salt) throw new Error("AUTH_SECRET environment variable is required.");
                const tokenSource = `${email}:${courseId || 'osi-model'}:course_access:${salt}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                const token = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                // Record Score in Student Profile (Per-Course)
                if (STATS_KV) {
                    let user = await STATS_KV.get(`user:${email}`, 'json');
                    if (user) {
                        if (!user.progress.scores) user.progress.scores = {};
                        user.progress.scores[courseId || 'osi-model'] = score;
                        // For backward compatibility with verify-certificate (which expects .score)
                        user.progress.score = Math.max(user.progress.score || 0, score);
                        await STATS_KV.put(`user:${email}`, JSON.stringify(user));
                    }
                }

                return new Response(JSON.stringify({ token }), { headers: corsHeaders });
            }

            // 3.6 UPDATE COURSE PROGRESS
            if (path === '/update-progress' && request.method === 'POST') {
                const body = await request.json().catch(() => ({}));
                const { email, chapterId, token, courseId } = body;

                // Token Validation
                const salt = env.AUTH_SECRET;
                if (!salt) throw new Error("AUTH_SECRET environment variable is required.");
                const tokenSource = `${email}:${courseId || 'osi-model'}:course_access:${salt}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                const expectedToken = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                if (token !== expectedToken) {
                    return new Response(JSON.stringify({ error: 'Invalid Token' }), { status: 403, headers: corsHeaders });
                }

                if (STATS_KV) {
                    let user = await STATS_KV.get(`user:${email}`, 'json');
                    if (user) {
                        if (!user.progress.chapters.includes(chapterId)) {
                            user.progress.chapters.push(chapterId);
                            await STATS_KV.put(`user:${email}`, JSON.stringify(user));
                        }
                    }
                }
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // 4. SECURE QUESTION FETCH
            if (path === '/get-questions' && request.method === 'GET') {
                const layerParam = url.searchParams.get('layer'); // ?layer=1
                const res = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/questions.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });

                if (!res.ok) {
                    return new Response(JSON.stringify([{ question: "Error loading from vault", options: ["A", "B", "C", "D"], id: "err" }]), { headers: corsHeaders });
                }

                let allQuestions = await res.json();

                if (layerParam) {
                    allQuestions = allQuestions.filter(q => q.layer == layerParam);
                }

                const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

                // Strip answers and explanations so the client can't cheat
                const sanitized = shuffled.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options
                }));

                return new Response(JSON.stringify(sanitized), { headers: corsHeaders });
            }

            // 4.5 SECURE QUIZ EVALUATION
            if (path === '/evaluate-quiz' && request.method === 'POST') {
                // answers = { "q1_1": 2, "q1_5": 0, ... }
                const { answers } = await request.json();

                const res = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/questions.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });

                if (!res.ok) {
                    return new Response(JSON.stringify({ error: "Failed to load vault" }), { status: 500, headers: corsHeaders });
                }

                let allQuestions = await res.json();
                let score = 0;
                let results = [];

                for (let qId in answers) {
                    const selected = answers[qId];
                    const actualQ = allQuestions.find(q => q.id === qId);

                    if (actualQ) {
                        if (actualQ.answer === selected) {
                            score++;
                            results.push({ id: qId, correct: true });
                        } else {
                            results.push({
                                id: qId,
                                correct: false,
                                explanation: actualQ.explanation,
                                correctAnswer: actualQ.answer
                            });
                        }
                    }
                }

                return new Response(JSON.stringify({ score, total: Object.keys(answers).length, results }), { headers: corsHeaders });
            }

            // 5. VALIDATE TOKEN (Self-Service & Verification)
            if (path === '/validate-token' && request.method === 'POST') {
                const { email, token, courseId } = await request.json();
                const salt = env.AUTH_SECRET;
                if (!salt) throw new Error("AUTH_SECRET environment variable is required.");
                const tokenSource = `${email}:${courseId || 'osi-model'}:course_access:${salt}`;
                const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                const expectedToken = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                if (token === expectedToken) {
                    return new Response(JSON.stringify({ valid: true }), { headers: corsHeaders });
                }
                return new Response(JSON.stringify({ valid: false }), { status: 403, headers: corsHeaders });
            }

            // 6. PUBLIC CERTIFICATE VERIFICATION (Lookup by Token Prefix)
            if (path === '/verify-certificate' && request.method === 'GET') {
                const tokenPrefix = url.searchParams.get('token');
                const courseIdReq = url.searchParams.get('course') || 'osi-model';

                if (!tokenPrefix || tokenPrefix.length < 8) {
                    return new Response(JSON.stringify({ valid: false, error: 'Invalid Token Format' }), { status: 400, headers: corsHeaders });
                }

                if (STATS_KV) {
                    // Fetch all users to find the matching prefix
                    const users = await STATS_KV.list({ prefix: 'user:' });
                    const salt = env.AUTH_SECRET;
                    if (!salt) throw new Error("AUTH_SECRET environment variable is required.");

                    for (let key of users.keys) {
                        const email = key.name.replace('user:', '');

                        // We need to check against multiple potential course tokens if we don't know the course
                        // but here we expect the course to be passed or we default to osi-model
                        const tokenSource = `${email}:${courseIdReq}:course_access:${salt}`;
                        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenSource));
                        const expectedToken = btoa(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

                        // Check if the first 8 characters match
                        if (expectedToken.substring(0, tokenPrefix.length) === tokenPrefix) {
                            // Match found! Get user details
                            const userDataStr = await STATS_KV.get(key.name);
                            if (userDataStr) {
                                const userData = JSON.parse(userDataStr);
                                // Check score for specific course
                                const courseScore = (userData.progress.scores && userData.progress.scores[courseIdReq]) || (courseIdReq === 'osi-model' ? userData.progress.score : 0);

                                if (courseScore >= 7) {
                                    return new Response(JSON.stringify({
                                        valid: true,
                                        name: userData.name !== 'Anonymous' ? userData.name : email.split('@')[0],
                                        date: userData.registeredAt,
                                        course: courseIdReq
                                    }), { headers: corsHeaders });
                                }
                            }
                        }
                    }
                }

                return new Response(JSON.stringify({ valid: false, error: 'Certificate Not Found' }), { status: 404, headers: corsHeaders });
            }

            return new Response('NUC7 Bridge: Path Not Found', { status: 404, headers: corsHeaders });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
    }
};
