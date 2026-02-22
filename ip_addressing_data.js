const ipAddressingData = {
    id: "ip-addressing",
    title: "IP Addressing & Subnetting Mastery",
    certificateBg: "nameYY.png",
    layers: [
        {
            "id": 1,
            "name": "Module 1: Binary & IP Fundamentals",
            "text": "Understanding the language of the internet. How computers read IP addresses in 0s and 1s.",
            "html": `
                <h3>The 32-Bit World</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    An IPv4 address isn't actually four numbers separated by dots (like 192.168.1.1). To a computer, it's a single <strong>32-bit binary string</strong>. We use "Dotted-Decimal Notation" strictly for human readability.
                </p>
                
                <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #4a90e2;">
                    <h4 style="margin-bottom: 1rem; color: #4a90e2;">Binary Breakdown</h4>
                    <p style="color: var(--text-secondary); line-height: 1.6;">
                        Each "Octet" in an IP address consists of 8 bits. 
                        The value 192 in binary is <code>11000000</code>. 
                        The value 168 is <code>10101000</code>.
                        Learning binary-to-decimal conversion is the absolute foundation of network engineering.
                    </p>
                </div>

                <h4>Key Concepts</h4>
                <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
                    <li><strong>Octets:</strong> Four 8-bit groups making up the 32-bit address.</li>
                    <li><strong>Base-2 System:</strong> Everything is calculated in powers of 2 (128, 64, 32, 16, 8, 4, 2, 1).</li>
                    <li><strong>Dynamic vs Static:</strong> How IPs are assigned (automatically via DHCP or manually by an admin).</li>
                </ul>
            `
        },
        {
            "id": 2,
            "name": "Module 2: IP Classes & Reserved Ranges",
            "text": "How IP addresses were originally categorized and the special addresses you should never use on the public web.",
            "html": `
                <h3>The Legacy Class System</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    In the early days, IPs were divided into Classes (A, B, C, D, E) based on the first octet. While we now use CIDR, understanding classes is vital for legacy systems and certification.
                </p>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem; color: var(--text-secondary);">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 1rem;">Class</th>
                        <th style="text-align: left; padding: 1rem;">Range</th>
                        <th style="text-align: left; padding: 1rem;">Default Mask</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 1rem;">Class A</td>
                        <td style="padding: 1rem;">1 - 126</td>
                        <td style="padding: 1rem;">255.0.0.0</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 1rem;">Class B</td>
                        <td style="padding: 1rem;">128 - 191</td>
                        <td style="padding: 1rem;">255.255.0.0</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 1rem;">Class C</td>
                        <td style="padding: 1rem;">192 - 223</td>
                        <td style="padding: 1rem;">255.255.255.0</td>
                    </tr>
                </table>

                <h4 style="color: #4ade80;">Reserved Ranges</h4>
                <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
                    <li><strong>Loopback (127.0.0.1):</strong> Used for testing the local machine's TCP/IP stack.</li>
                    <li><strong>Private IPs (RFC 1918):</strong> (10.x, 172.16.x, 192.168.x) - Not routable on the public internet.</li>
                    <li><strong>APIPA (169.254.x.x):</strong> Automatically assigned when a DHCP server cannot be reached.</li>
                </ul>
            `
        },
        {
            "id": 3,
            "name": "Module 3: Subnetting & CIDR",
            "text": "Efficiency and Control. How to divide large networks into smaller, manageable chunks.",
            "html": `
                <h3>Subnetting Calculator</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    Subnetting is the process of taking bits from the host portion of an IP address and giving them to the network portion. Use the tool below to master CIDR notation.
                </p>

                <div id="calculator-root" style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 3rem;">
                    <h4 style="margin-bottom: 1.5rem; text-align: center;">Interactive Subnet Calculator</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">IP Address</label>
                            <input type="text" id="calc-ip" value="192.168.1.1" style="width: 100%;" oninput="runCalc()">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">CIDR Mask (e.g., 24)</label>
                            <input type="number" id="calc-cidr" value="24" min="0" max="32" style="width: 100%;" oninput="runCalc()">
                        </div>
                    </div>
                    <div id="calc-results" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                            <span style="opacity: 0.5;">Subnet Mask:</span><br>
                            <strong id="res-mask">255.255.255.0</strong>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                            <span style="opacity: 0.5;">Network Addr:</span><br>
                            <strong id="res-net">192.168.1.0</strong>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                            <span style="opacity: 0.5;">Broadcast Addr:</span><br>
                            <strong id="res-broad">192.168.1.255</strong>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                            <span style="opacity: 0.5;">Usable Hosts:</span><br>
                            <strong id="res-hosts">254</strong>
                        </div>
                    </div>
                </div>

                <script>
                    function runCalc() {
                        const ip = document.getElementById('calc-ip').value;
                        const cidr = parseInt(document.getElementById('calc-cidr').value);
                        if (isNaN(cidr) || cidr < 0 || cidr > 32) return;

                        // Simple calc logic for common cases
                        const maskArr = [];
                        for (let i = 0; i < 4; i++) {
                            const bits = Math.max(0, Math.min(8, cidr - (i * 8)));
                            maskArr.push(256 - Math.pow(2, 8 - bits));
                        }
                        const mask = maskArr.join('.');
                        document.getElementById('res-mask').innerText = mask;

                        const hosts = Math.pow(2, 32 - cidr);
                        document.getElementById('res-hosts').innerText = hosts > 2 ? hosts - 2 : (hosts === 1 ? '1 (Host)' : '0');

                        // Network/Broadcast simplified (first octet focus for demo)
                        const ipParts = ip.split('.').map(Number);
                        if (ipParts.length === 4) {
                            const netParts = ipParts.map((p, i) => p & maskArr[i]);
                            document.getElementById('res-net').innerText = netParts.join('.');
                            const broadParts = netParts.map((p, i) => p | (255 - maskArr[i]));
                            document.getElementById('res-broad').innerText = broadParts.join('.');
                        }
                    }
                    setTimeout(runCalc, 500); // Initial run
                </script>

                <h4>Subnetting Essentials</h4>
                <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
                    <li><strong>CIDR (Classless Inter-Domain Routing):</strong> Replaced the class system to prevent IP exhaustion.</li>
                    <li><strong>Variable Length Subnet Masking (VLSM):</strong> Allows for subnets of different sizes within the same network.</li>
                </ul>
            `
        },
        {
            "id": 4,
            "name": "Module 4: IPv6 Transition",
            "text": "The 128-bit future. Why we moved away from 4 billion addresses to 340 undecillion.",
            "html": `
                <h3>IPv6: Beyond the Limit</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    IPv4 ran out of unique addresses in the mid-2010s. IPv6 uses hexadecimal notation and a 128-bit address space, meaning every grain of sand on Earth could have its own IP address many times over.
                </p>

                <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #a78bfa;">
                    <h4 style="margin-bottom: 1rem; color: #a78bfa;">IPv6 Address Structure</h4>
                    <p style="color: var(--text-secondary); line-height: 1.6;">
                        Format: <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code><br>
                        - Uses Hexadecimal (0-9, A-F).<br>
                        - Zero Compression: <code>2001:db8:85a3::8a2e:370:7334</code><br>
                        - No more NAT, no more broadcasts (optimized multicast instead).
                    </p>
                </div>

                <h4>Transition Mechanisms</h4>
                <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
                    <li><strong>Dual Stack:</strong> Running both IPv4 and IPv6 simultaneously on compatible devices.</li>
                    <li><strong>Tunneling:</strong> Encapsulating IPv6 packets inside IPv4 packets to traverse older networks.</li>
                </ul>
            `
        }
    ]
};
