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
