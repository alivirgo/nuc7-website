/**
 * NUC7 Authentication Bridge v2
 * 
 * Manages:
 * 1. Email-gated quiz requests.
 * 2. Randomized question delivery from private vault.
 * 3. Quiz validation and Course access token generation.
 */

export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

        const url = new URL(request.url);
        const path = url.pathname;

        // Endpoint: POST /track
        // Records a visitor hit (Referrer, Path, UA)
        if (path === '/track' && request.method === 'POST') {
            const hitData = await request.json();
            // In production, we would log this to a KV store or Durable Object
            // For now, we return success to the frontend tracking script
            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Endpoint: POST /stats
        // Protected endpoint to retrieve site metrics
        if (path === '/stats' && request.method === 'POST') {
            const { password } = await request.json();

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

            if (hashHex === vault.adminPasswordHash) {
                // Simulated live stats for the dashboard
                return new Response(JSON.stringify({
                    activeUsers: 42,
                    pageViews: 1248,
                    passRate: '82%',
                    recentHits: [
                        { time: new Date().toISOString(), path: '/', ref: 'Google' },
                        { time: new Date().toISOString(), path: '/quiz.html', ref: 'Direct' }
                    ]
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } else {
                return new Response('Unauthorized', { status: 401 });
            }
        }

        try {
            // Endpoint: GET /get-questions
            // Fetches 10 random questions from the private vault
            if (path === '/get-questions') {
                const vaultRes = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/questions.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });

                const questions = await vaultRes.json();
                // Randomize and pick 10
                const shuffled = questions.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 10).map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options
                }));

                return new Response(JSON.stringify(selected), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Endpoint: POST /validate-quiz
            // Checks answers against vault and returns access token
            if (path === '/validate-quiz' && request.method === 'POST') {
                const { email, answers } = await request.json(); // answers: { id: choiceIndex }

                const vaultRes = await fetch(`https://api.github.com/repos/alivirgo/nuc7-vault/contents/questions.json`, {
                    headers: {
                        'Authorization': `token ${env.GITHUB_PAT}`,
                        'Accept': 'application/vnd.github.v3.raw',
                        'User-Agent': 'nuc7-auth-bridge'
                    }
                });
                const questions = await vaultRes.json();

                let score = 0;
                answers.forEach(ua => {
                    const q = questions.find(v => v.id === ua.id);
                    if (q && q.answer === ua.choice) score++;
                });

                if (score >= 7) {
                    // Generate a simple token (in production, use JWT signed with secret)
                    const token = btoa(`${email}:${Date.now()}:passed`);
                    return new Response(JSON.stringify({ success: true, score, token }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                } else {
                    return new Response(JSON.stringify({ success: false, score, error: 'Failed' }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
            }

            return new Response('Not Found', { status: 404 });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
