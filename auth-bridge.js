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
                const body = await request.json();
                const { name, email, courseId } = body;
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
                        selectedCourse: courseId || 'osi-model',
                        progress: { score: 0, scores: {}, chapters: [] }
                    };
                    await STATS_KV.put(`user:${email}`, JSON.stringify(userData));

                    const totalReg = (parseInt(await STATS_KV.get('totalReg')) || 0) + 1;
                    await STATS_KV.put('totalReg', totalReg.toString());
                }

                // 3. INTEGRATION: SEND EMAIL (SENDGRID)
                if (env.SENDGRID_API_KEY) {
                    const frontendUrl = env.FRONTEND_URL || 'https://nuc7.com';
                    const quizUrl = `${frontendUrl}/quiz.html?email=${encodeURIComponent(email)}&token=${token}${courseId ? `&course=${courseId}` : ''}`;

                    const courseLabel = {
                        'osi-model': 'OSI Model Mastery',
                        'ip-addressing': 'IP Addressing & Subnetting',
                        'network-fundamentals': 'Network Fundamentals'
                    }[courseId] || 'Networking Mastery';

                    const studentName = name || 'Candidate';

                    const emailHtml = `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="font-size: 2.5rem; font-weight: 200; color: #ffffff; margin: 0;">NUC7</h1>
                            <p style="color: #888; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;">networking ultimate courses</p>
                        </div>

                        <div style="padding: 30px;">
                            <p style="font-size: 1.1rem; color: #ccc;">Hello <strong style="color: #fff;">${studentName}</strong>,</p>
                            <p style="color: #999; line-height: 1.7;">Thank you for registering for <strong style="color: #4a90e2;">${courseLabel}</strong>. To gain access to the course portal, you must first pass a short qualification assessment.</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${quizUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1rem;">Begin Qualification Assessment</a>
                            </div>

                            <p style="color: #666; font-size: 0.85rem; line-height: 1.6;">If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="color: #4a90e2; font-size: 0.8rem; word-break: break-all;">${quizUrl}</p>

                            <hr style="border: none; border-top: 1px solid #222; margin: 25px 0;">

                            <p style="color: #555; font-size: 0.8rem; line-height: 1.5;">This link is unique to you and should not be shared. A minimum score of 7/10 is required for course access. Upon completion, you will receive a verifiable NUC7 certificate.</p>
                        </div>

                        <div style="background: #050505; padding: 20px 30px; text-align: center;">
                            <p style="color: #444; font-size: 0.75rem; margin: 0;">&copy; 2026 NUC7 Architecture. All rights reserved.</p>
                            <p style="color: #333; font-size: 0.7rem; margin-top: 4px;">nuc7.com</p>
                        </div>
                    </div>`;

                    const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            personalizations: [{ to: [{ email, name: studentName }] }],
                            from: { email: env.SENDGRID_FROM_EMAIL || 'noreply@nuc7.com', name: 'NUC7 Course Team' },
                            subject: `NUC7 — Your ${courseLabel} Assessment Link`,
                            content: [{ type: 'text/html', value: emailHtml }]
                        })
                    });

                    if (!sgResponse.ok) {
                        const sgError = await sgResponse.text();
                        console.log(`SendGrid Error [${sgResponse.status}]: ${sgError}`);
                        return new Response(JSON.stringify({
                            success: true,
                            message: 'Registered but email dispatch failed.',
                            emailError: `SendGrid ${sgResponse.status}`,
                            debug: sgError
                        }), { headers: corsHeaders });
                    }
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

            // 7. DIAGNOSTIC: Check environment variables (no secrets exposed)
            if (path === '/debug-env' && request.method === 'GET') {
                return new Response(JSON.stringify({
                    SENDGRID_API_KEY: env.SENDGRID_API_KEY ? `SET (${env.SENDGRID_API_KEY.length} chars, starts with ${env.SENDGRID_API_KEY.substring(0, 5)}...)` : 'NOT SET',
                    AUTH_SECRET: env.AUTH_SECRET ? 'SET' : 'NOT SET',
                    GITHUB_PAT: env.GITHUB_PAT ? 'SET' : 'NOT SET',
                    FRONTEND_URL: env.FRONTEND_URL || 'NOT SET (will use fallback)',
                    SENDGRID_FROM_EMAIL: env.SENDGRID_FROM_EMAIL || 'NOT SET (will use noreply@nuc7.com)',
                    KV_BOUND: STATS_KV ? true : false,
                    workerVersion: 'v3-sendgrid-debug'
                }, null, 2), { headers: corsHeaders });
            }

            return new Response('NUC7 Bridge: Path Not Found', { status: 404, headers: corsHeaders });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
    }
};
