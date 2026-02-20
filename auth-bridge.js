/**
 * nuc7 Authentication Bridge
 * 
 * This worker securely fetches the password hash and API keys from a private 
 * GitHub repository and verifies the user's password.
 */

export default {
    async fetch(request, env) {
        // CORS Headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
        }

        try {
            const { password } = await request.json();

            // 1. Fetch vault.json from Private Repo using GitHub API
            // Requires GITHUB_PAT secret in Worker environment
            const githubUrl = 'https://api.github.com/repos/alivirgo/nuc7-vault/contents/vault.json';
            const response = await fetch(githubUrl, {
                headers: {
                    'Authorization': `token ${env.GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3.raw',
                    'User-Agent': 'nuc7-auth-bridge'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vault data');
            }

            const vault = await response.json();

            // 2. Hash incoming password
            const msgUint8 = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // 3. Compare hashes
            if (hashHex === vault.passwordHash) {
                return new Response(JSON.stringify({
                    success: true,
                    apiKeys: vault.apiKeys // Only return keys if authed
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } else {
                return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

        } catch (err) {
            return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
