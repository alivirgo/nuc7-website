var networkFundamentalsData = {
    id: "network-fundamentals",
    title: "Network Fundamentals Mastery",
    certificateBg: "nameZZ.png",
    layers: [
        {
            "id": 1,
            "name": "Unit 1: Network Fundamentals",
            "text": "Core concepts of networking, topologies, and the foundations of communication.",
            "html": `
                <div class="module-content">
                    <h3>Unit 1: Network Fundamentals</h3>
                    <div class="submodule">
                        <h4>What is Networking</h4>
                        <p>Networking is the practice of transporting and exchanging data between nodes over a shared medium in an information system. It's the backbone of the digital age, enabling everything from simple file sharing to complex cloud computing. A network consists of end devices (PCs, servers), intermediary devices (switches, routers), and the media connecting them (copper, fiber, wireless).</p>
                    </div>
                    <div class="submodule">
                        <h4>Network Topologies</h4>
                        <p>Topologies define the physical or logical layout of a network. Primary physical topologies include:</p>
                        <ul>
                            <li><strong>Star:</strong> All nodes connect to a central hub or switch. This is the most common topology in modern LANs because a failure of one cable only affects one end device.</li>
                            <li><strong>Mesh:</strong> Nodes are interconnected, providing high redundancy. Full mesh means every node connects to every other node (highly expensive). Partial mesh is common in WAN environments.</li>
                            <li><strong>Bus:</strong> All nodes share a single communication line. Historically used with coaxial cable; highly susceptible to collisions and a single point of failure.</li>
                            <li><strong>Ring:</strong> Nodes are connected in a closed loop (e.g., legacy Token Ring or modern FDDI).</li>
                        </ul>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to the OSI Model</h4>
                        <p>The Open Systems Interconnection (OSI) model provides a standardized framework for network communication. It consists of 7 layers: Application (7), Presentation (6), Session (5), Transport (4), Network (3), Data Link (2), and Physical (1). Each layer serves the layer above it and is served by the layer below it. Mnemonic to remember: <em>Please Do Not Throw Sausage Pizza Away</em>.</p>
                    </div>
                    <div class="submodule">
                        <h4>TCP/IP Stack Tutorial</h4>
                        <p>While OSI is a conceptual model, the TCP/IP suite is the functional model that actually runs the internet. It condenses the OSI into 4 layers: Application (representing OSI 5, 6, 7), Transport (OSI 4), Internet (OSI 3), and Network Access (OSI 1, 2). Data is encapsulated as it moves down the stack (Data -> Segment -> Packet -> Frame -> Bits).</p>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to Ethernet</h4>
                        <p>Ethernet (IEEE 802.3) is the dominant wired LAN technology. It operates at the Data Link and Physical layers. Ethernet uses MAC (Media Access Control) addresses—48-bit physical addresses burned into the NIC—for local delivery within the same network segment. It traditionally relied on CSMA/CD to manage collisions on shared media.</p>
                    </div>
                    <div class="submodule">
                        <h4>Collision & Broadcast Domains</h4>
                        <p><strong>Collision Domain:</strong> A section of a network where data packets can collide if sending simultaneously. Hubs create one large collision domain. Switches break up collision domains (every switch port is its own collision domain).<br><br><strong>Broadcast Domain:</strong> The logical extent of a network where all nodes can reach each other by Layer 2 broadcast (all F's MAC). Routers break up broadcast domains. Switches forward broadcasts out all ports except the receiving one.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 2,
            "name": "Unit 2: IP Addressing",
            "text": "Deep dive into IPv4, binary math, and the logic of subnetting.",
            "html": `
                <div class="module-content">
                    <h3>Unit 2: IP Addressing</h3>
                    <div class="submodule">
                        <h4>Introduction to IPv4</h4>
                        <p>Internet Protocol version 4 (IPv4) provides a 32-bit hierarchical address identifying hosts and networks. An address is written in dotted-decimal format (e.g., 192.168.1.1). It consists of a Network portion (identifying the street) and a Host portion (identifying the specific house), separated logically by the Subnet Mask.</p>
                    </div>
                    <div class="submodule">
                        <h4>Basics of Binary Numbers</h4>
                        <p>Computers process IP addresses in Base-2 (Binary). An IPv4 address contains 4 octets (8 bits each). Mastering the bit values is critical for subnetting: <strong>128 - 64 - 32 - 16 - 8 - 4 - 2 - 1</strong>. For example, the decimal number 192 is 11000000 in binary (128 + 64).</p>
                    </div>
                    <div class="submodule">
                        <h4>What is Subnetting?</h4>
                        <p>Subnetting is the art of borrowing bits from the Host portion of an IP address to create smaller, more efficient 'sub'-networks. This reduces broadcast traffic, improves security (by isolating departments), and prevents IP address wastage.</p>
                    </div>
                    <div class="submodule">
                        <h4>VLSM and CIDR</h4>
                        <p><strong>CIDR (Classless Inter-Domain Routing):</strong> Replaced rigid A/B/C classes with flexible prefix-length notation (e.g., /24 means the first 24 bits are the network).<br><strong>VLSM (Variable Length Subnet Mask):</strong> Subnetting a subnet. It allows allocating a /24 for a LAN of 200 users, and a /30 for a point-to-point WAN link of only 2 addresses, optimizing address space.</p>
                    </div>
                    <div class="submodule">
                        <h4>ARP (Address Resolution Protocol)</h4>
                        <p>ARP acts as the glue between Layer 3 (IP) and Layer 2 (MAC). When a host knows the destination IP but needs the physical MAC address for local frame delivery, it broadcasts an ARP Request ("Who has IP X? Tell IP Y"). The target responds with an ARP Reply containing its MAC.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 3,
            "name": "Unit 3: IPv6",
            "text": "The next generation of internet protocol addressing and configuration.",
            "html": `
                <div class="module-content">
                    <h3>Unit 3: IPv6</h3>
                    <div class="submodule">
                        <h4>The Need for IPv6</h4>
                        <p>The 32-bit IPv4 space (approx 4.3 billion addresses) has been exhausted. IPv6 uses a massive 128-bit address space, allowing for 340 undecillion addresses. IPv6 also eliminates the need for NAT, simplifies headers for faster processing, and mandates IPsec for built-in security.</p>
                    </div>
                    <div class="submodule">
                        <h4>IPv6 Address Structure & Types</h4>
                        <p>Addresses are written in 8 groups of 4 hexadecimal characters. You can compress them by removing leading zeros and replacing contiguous blocks of zeros with a double colon (::) once per address. Types include:<br>
                        - <strong>Global Unicast:</strong> Publicly routable (starts with 2000::/3).<br>
                        - <strong>Link-Local:</strong> For local subnet communication only (starts with FE80::/10).<br>
                        - <strong>Multicast:</strong> One-to-many delivery (starts with FF00::/8). Note: IPv6 uses multicast heavily in place of IPv4 broadcasts.</p>
                    </div>
                    <div class="submodule">
                        <h4>IPv6 EUI-64</h4>
                        <p>EUI-64 is a method where a host automatically generates its 64-bit Interface ID using its 48-bit MAC address. It splits the MAC in half, inserts FFFE in the middle, and flips the 7th bit of the first byte to form a globally unique 64-bit host identifier.</p>
                    </div>
                    <div class="submodule">
                        <h4>Stateless Autoconfiguration (SLAAC)</h4>
                        <p>SLAAC allows devices to connect to an IPv6 network and configure themselves without a DHCPv6 server. Devices send a Router Solicitation (RS) message. The local router responds with a Router Advertisement (RA) containing the network prefix. The host appends its EUI-64 or randomized interface ID to build a complete address.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 4,
            "name": "Unit 4: Transport Layer",
            "text": "Protocols for host-to-host communication and data integrity.",
            "html": `
                <div class="module-content">
                    <h3>Unit 4: Transport Layer</h3>
                    <div class="submodule">
                        <h4>TCP vs UDP</h4>
                        <p><strong>TCP (Transmission Control Protocol):</strong> Connection-oriented, reliable, and guaranteed delivery. Uses sequence numbers to reorder segments, acknowledgments to confirm receipt, and windowing for flow control. Ideal for HTTP, SSH, and FTP.<br><br><strong>UDP (User Datagram Protocol):</strong> Connectionless, unreliable, best-effort delivery. No acknowledgments or sequencing, meaning less overhead and faster speeds. Ideal for real-time traffic like VoIP, video streaming, and DNS.</p>
                    </div>
                    <div class="submodule">
                        <h4>TCP Three-Way Handshake</h4>
                        <p>Before TCP sends data, it establishes a reliable session. <br>1. Client sends a <strong>SYN</strong> (Synchronize) packet.<br>2. Server responds with a <strong>SYN-ACK</strong>.<br>3. Client finalizes with an <strong>ACK</strong>. The connection is now established.</p>
                    </div>
                    <div class="submodule">
                        <h4>Ports and Sockets</h4>
                        <p>The Transport layer uses port numbers to distinguish between multiple applications running on a single host. A Socket is the combination of an IP Address + Port Number (e.g., 192.168.1.5:80). Well-known ports include HTTP (80), HTTPS (443), SSH (22), and DNS (53).</p>
                    </div>
                    <div class="submodule">
                        <h4>ICMP (Internet Control Message Protocol)</h4>
                        <p>Technically an Internet layer protocol, ICMP is grouped here logically as it assists transport behavior. It's the diagnostic language of the network. Tools like Ping use Echo Request (Type 8) and Echo Reply (Type 0). Traceroute uses ICMP TTL (Time to Live) Exceeded messages to map the path to a destination.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 5,
            "name": "Unit 5: Switching Concepts",
            "text": "Layer 2 logic, VLANs, and InterVLAN routing.",
            "html": `
                <div class="module-content">
                    <h3>Unit 5: Switching Concepts</h3>
                    <div class="submodule">
                        <h4>MAC Address Learning and Forwarding</h4>
                        <p>A Layer 2 switch builds a CAM (Content Addressable Memory) table. When a frame enters a port, the switch records the <em>Source MAC</em> address and binds it to that port. When forwarding, if the Destination MAC is in the table, it forwards out that specific port. If unknown (or an all-F's broadcast), it floods the frame out all ports except the receiving one.</p>
                    </div>
                    <div class="submodule">
                        <h4>VLANs (Virtual LANs)</h4>
                        <p>VLANs logically divide a physical switch into multiple independent broadcast domains. This provides security (Accounting traffic cannot reach Engineering), reduces unnecessary broadcast noise, and allows logical grouping regardless of physical desk locations.</p>
                    </div>
                    <div class="submodule">
                        <h4>Trunking & 802.1Q</h4>
                        <p>When connecting two switches that both house VLAN 10 and VLAN 20, you use a Trunk link. A Trunk can carry traffic for multiple VLANs. The IEEE 802.1Q standard inserts a 4-byte tag into the Ethernet frame header as it crosses the trunk, identifying which VLAN the frame belongs to, then strips the tag upon exit.</p>
                    </div>
                    <div class="submodule">
                        <h4>Inter-VLAN Routing</h4>
                        <p>Because VLANs represent isolated Layer 3 networks, traffic <em>cannot</em> move between them without a router. Common methods include:<br><strong>Router-on-a-Stick (ROAS):</strong> Connecting a router to a switch via a single trunk link and using sub-interfaces (e.g., G0/0.10, G0/0.20).<br><strong>Layer 3 SVI (Switch Virtual Interface):</strong> Modern approach using a Multilayer Switch to route traffic internally at hardware speeds using logical VLAN interfaces.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 6,
            "name": "Unit 6: Spanning Tree Protocol",
            "text": "Preventing Layer 2 loops and ensuring network stability.",
            "html": `
                <div class="module-content">
                    <h3>Unit 6: Spanning Tree Protocol (STP)</h3>
                    <div class="submodule">
                        <h4>The Danger of Layer 2 Loops</h4>
                        <p>Unlike IP packets, Ethernet frames have no TTL (Time to Live) mechanism. If redundant physical links exist without management, broadcast frames will loop endlessly, creating a "Broadcast Storm" that rapidly depletes CPU and bandwidth, crashing the network. Spanning Tree Protocol (802.1D) solves this.</p>
                    </div>
                    <div class="submodule">
                        <h4>How STP Works</h4>
                        <p>Switches exchange BPDUs (Bridge Protocol Data Units). They elect a <strong>Root Bridge</strong> (the switch with the lowest Bridge ID, composed of Priority + MAC address). The Root Bridge is the center of the network; all its ports are Designated (forwarding). Other switches calculate the shortest path to the Root, designating that as the Root Port. Redundant, less optimal links are placed in a Blocking state, breaking the physical loop logically.</p>
                    </div>
                    <div class="submodule">
                        <h4>RSTP and PortFast</h4>
                        <p><strong>Rapid Spanning Tree (802.1w):</strong> Enhances classic STP by reducing convergence times from 50 seconds to mere milliseconds during topological changes by redefining port states (Discarding, Learning, Forwarding).<br><strong>PortFast:</strong> A Cisco feature applied to edge ports connected to end-users (PCs, printers). It bypasses listening/learning phases, moving instantly to forwarding, preventing DHCP timeouts on boot.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 7,
            "name": "Unit 7: EtherChannel",
            "text": "Link aggregation for increased bandwidth and redundancy.",
            "html": `
                <div class="module-content">
                    <h3>Unit 7: EtherChannel (Link Aggregation)</h3>
                    <div class="submodule">
                        <h4>Why EtherChannel?</h4>
                        <p>If you connect four 1Gbps cables between two switches, Spanning Tree will block three of them to prevent loops, yielding only 1Gbps of usable bandwidth. EtherChannel logically bundles these physical links into one logical interface. STP sees it as a single link, so all 4Gbps of bandwidth becomes active, providing massive throughput and built-in redundancy.</p>
                    </div>
                    <div class="submodule">
                        <h4>Negotiation Protocols</h4>
                        <p>Bundles can be negotiated statically or dynamically:<br><strong>LACP (Link Aggregation Control Protocol, 802.3ad):</strong> Industry standard, uses Active/Passive modes.<br><strong>PAgP (Port Aggregation Protocol):</strong> Cisco proprietary, uses Desirable/Auto modes.</p>
                    </div>
                    <div class="submodule">
                        <h4>Load Balancing</h4>
                        <p>Traffic over an EtherChannel is usually hashed based on Source/Destination MAC or IP addresses. A single file transfer will only use the bandwidth of one physical link, but multiple distinct sessions are distributed across the bundle.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 8,
            "name": "Unit 8: Routing Fundamentals",
            "text": "Path selection and packet forwarding principles.",
            "html": `
                <div class="module-content">
                    <h3>Unit 8: Routing Fundamentals</h3>
                    <div class="submodule">
                        <h4>The Routing Process</h4>
                        <p>Routing is a Layer 3 function. When a router receives a packet, it extracts the Destination IP, consults its Routing Table to find the best matching network, strips off the old Layer 2 MAC frame, determines the exit interface, encapsulates the packet in a new Layer 2 frame targeting the next hop's MAC address, and forwards it.</p>
                    </div>
                    <div class="submodule">
                        <h4>Static vs Dynamic Routing</h4>
                        <p><strong>Static Routes:</strong> Manually configured paths. Excellent for small networks or stub networks (single exit point) due to zero CPU overhead and extreme security. But they don't adapt to link failures.<br><strong>Dynamic Routing:</strong> Routers use protocols (OSPF, BGP) to advertise their local networks, discover paths automatically, and dynamically route around link failures in real time.</p>
                    </div>
                    <div class="submodule">
                        <h4>Administrative Distance (AD)</h4>
                        <p>If a router learns about the exact same destination from multiple sources (e.g., a static route and OSPF), it uses AD to determine which path is more trustworthy. Lower is better. <br>Common ADs: Connected Interface = 0, Static Route = 1, eBGP = 20, EIGRP = 90, OSPF = 110.</p>
                    </div>
                    <div class="submodule">
                        <h4>Longest Match Routing Rule</h4>
                        <p>If a router table has multiple entries covering a destination IP (e.g., 10.0.0.0/8 and 10.1.1.0/24), a packet destined for 10.1.1.5 will always follow the <strong>/24 route</strong> because the longest prefix mask provides the most specific, accurate path.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 9,
            "name": "Unit 9: Dynamic Routing - OSPF",
            "text": "Open Shortest Path First - An industry standard link-state protocol.",
            "html": `
                <div class="module-content">
                    <h3>Unit 9: OSPF (Open Shortest Path First)</h3>
                    <div class="submodule">
                        <h4>Link-State Logic</h4>
                        <p>OSPF is a Link-State routing protocol. Rather than trading whole routing tables, OSPF routers trade tiny puzzle pieces called LSAs (Link State Advertisements) representing their interfaces and neighbors. Every router builds an identical topological map (LSDB), then runs the Dijkstra Shortest Path First algorithm to independently calculate the best routes.</p>
                    </div>
                    <div class="submodule">
                        <h4>OSPF Areas</h4>
                        <p>To prevent the LSDB from growing too massively and exhausting router memory in enterprise networks, OSPF uses a two-tier hierarchical design. All traffic must cross the Backbone Area (Area 0). Other areas (Area 1, Area 2) connect directly to the backbone via ABRs (Area Border Routers).</p>
                    </div>
                    <div class="submodule">
                        <h4>OSPF Metric</h4>
                        <p>OSPF uses <strong>Cost</strong> as its metric. Cost is inversely proportional to bandwidth (Cost = Reference Bandwidth / Interface Bandwidth). A 10Gbps link has a much lower cost than a 100Mbps link, so OSPF will route over the 10Gbps link.</p>
                    </div>
                    <div class="submodule">
                        <h4>DR and BDR Election</h4>
                        <p>On shared multiaccess networks (like Ethernet switches), establishing neighbor adjacencies between *every* router generates an N-squared scaling problem. OSPF solves this by electing a Designated Router (DR) to act as the central distribution point for LSAs, and a Backup Designated Router (BDR) for redundancy.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 10,
            "name": "Unit 10: Dynamic Routing - EIGRP and BGP",
            "text": "Distance vector and Path-Vector protocols driving ISPs.",
            "html": `
                <div class="module-content">
                    <h3>Unit 10: EIGRP and BGP Overview</h3>
                    <div class="submodule">
                        <h4>EIGRP (Enhanced Interior Gateway Routing Protocol)</h4>
                        <p>Originally Cisco proprietary, now an open standard. It is an Advanced Distance Vector protocol using the DUAL (Diffusing Update Algorithm). It is uniquely powerful because it supports <strong>Unequal Cost Load Balancing</strong> and provides instantaneous backup paths (Feasible Successors) resulting in near sub-second convergence times.</p>
                    </div>
                    <div class="submodule">
                        <h4>EIGRP Metrics</h4>
                        <p>Unlike OSPF's simple cost, EIGRP uses a composite metric known by K-values. By default, it calculates the path based on the minimum <strong>Bandwidth</strong> along the path plus the cumulative <strong>Delay</strong>. It can also factor in Reliability and Load, though this is rarely recommended.</p>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to BGP (Border Gateway Protocol)</h4>
                        <p>While OSPF and EIGRP are IGPs (Interior Gateway Protocols) used *inside* a company, BGP is the EGP (Exterior Gateway Protocol) that runs the global Internet. It is a path-vector protocol that routes traffic between Autonomous Systems (AS) based heavily on complex policy implementations rather than simple shortest-path metrics.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 11,
            "name": "Unit 11: First Hop Redundancy (FHRP)",
            "text": "Gateway redundancy using HSRP, VRRP, and GLBP.",
            "html": `
                <div class="module-content">
                    <h3>Unit 11: First Hop Redundancy Protocols (FHRP)</h3>
                    <div class="submodule">
                        <h4>The Default Gateway Problem</h4>
                        <p>PCs are configured with a single IP address for their Default Gateway. If that physical router fails, the PCs lose internet access because they have no mechanism to dynamically switch to a backup router. FHRP solves this by virtualizing the gateway.</p>
                    </div>
                    <div class="submodule">
                        <h4>HSRP (Hot Standby Router Protocol)</h4>
                        <p>A Cisco protocol where multiple routers share a generic, virtual IP and MAC address. One router is elected Active to forward traffic, and the other is Standby. If the Active router fails, the Standby instantly assumes the virtual IP, and client traffic restores without the PCs ever knowing the physical hardware died.</p>
                    </div>
                    <div class="submodule">
                        <h4>VRRP and GLBP</h4>
                        <p><strong>VRRP (Virtual Router Redundancy Protocol):</strong> The open-standard equivalent to HSRP. Functions via Master/Backup election.<br><strong>GLBP (Gateway Load Balancing Protocol):</strong> A Cisco protocol that not only provides redundancy like HSRP but actively load-balances traffic from PCs across multiple routers simultaneously by answering ARP requests with different virtual MACs.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 12,
            "name": "Unit 12: WAN Technologies",
            "text": "Connecting over long distances: MPLS, VPNs, and SD-WAN.",
            "html": `
                <div class="module-content">
                    <h3>Unit 12: WAN Architecture</h3>
                    <div class="submodule">
                        <h4>Legacy vs Modern WAN</h4>
                        <p>Historically, companies connected branch offices using expensive Point-to-Point leased lines (T1/T3), requiring PPP or HDLC encapsulations. Modern deployments rely heavily on packet-switched provider networks like MPLS, or overlay tunnels running over cheap public broadband connections.</p>
                    </div>
                    <div class="submodule">
                        <h4>Site-to-Site VPNs (IPsec)</h4>
                        <p>A Virtual Private Network creates a secure, encrypted tunnel over the public, untrusted internet. IPsec operates at Layer 3, using IKE/ISAKMP to authenticate endpoints and negotiate encryption keys, and ESP (Encapsulating Security Payload) to heavily encrypt the transit data, providing an inexpensive, highly secure WAN solution.</p>
                    </div>
                    <div class="submodule">
                        <h4>The Rise of SD-WAN</h4>
                        <p>Software-Defined WAN is replacing traditional MPLS circuits. An SD-WAN edge router connects to multiple transport links (e.g., 4G LTE, Commodity Internet, and MPLS). A centralized controller dictates policies, and the edge router dynamically steers critical traffic (like VoIP) over the cleanest link in real-time based on jitter, loss, and latency telemetry.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 13,
            "name": "Unit 13: NAT & PAT",
            "text": "Network Address Translation and Port Address Translation.",
            "html": `
                <div class="module-content">
                    <h3>Unit 13: Address Translation</h3>
                    <div class="submodule">
                        <h4>Why NAT exists</h4>
                        <p>The RFC 1918 standard defines Private IPv4 blocks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). These IPs are not routable on the public internet. NAT translates these private internal addresses into public, globally routable addresses at the edge firewall or router.</p>
                    </div>
                    <div class="submodule">
                        <h4>Static vs Dynamic NAT</h4>
                        <p><strong>Static NAT:</strong> One-to-One mapping. Used to expose an internal web server (192.168.1.10) permanently to a public IP (203.0.113.5).<br><strong>Dynamic NAT:</strong> Translates internal IPs to a pool of public IPs. If the pool is exhausted, subsequent internal hosts must wait for a session to drop before connecting.</p>
                    </div>
                    <div class="submodule">
                        <h4>Port Address Translation (PAT / NAT Overload)</h4>
                        <p>This is what your home router uses. It allows thousands of private internal devices to share a <em>single</em> public IP address. The router tracks sessions by modifying the source port number and maintaining a translation state table. This powerful mechanism single-handedly delayed the depletion of IPv4 addresses for two decades.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 14,
            "name": "Unit 14: Access Control Lists",
            "text": "Security and traffic filtering on routers.",
            "html": `
                <div class="module-content">
                    <h3>Unit 14: Access Control Lists (ACLs)</h3>
                    <div class="submodule">
                        <h4>How ACLs Function</h4>
                        <p>An ACL is a sequential list of permit or deny statements (ACEs - Access Control Entries). They are applied to router interfaces in either an Inbound or Outbound direction. A packet is evaluated top-down against the rules. Once a match is found, the action is taken and no further rules are processed. <strong>CRITICAL:</strong> Every ACL has an implicit "Deny All" command at the very bottom.</p>
                    </div>
                    <div class="submodule">
                        <h4>Standard vs Extended ACLs</h4>
                        <p><strong>Standard ACLs (1-99):</strong> Can ONLY filter based on Source IP Address. Because they are blunt instruments, best practice mandates placing them as close to the Destination as possible.<br><strong>Extended ACLs (100-199):</strong> Highly granular. Can filter based on Source IP, Destination IP, Protocol (TCP/UDP), and specific Port numbers (e.g., blocking only port 80). Best practice places them as close to the Source as possible to kill unwanted traffic before it consumes network bandwidth.</p>
                    </div>
                    <div class="submodule">
                        <h4>Wildcard Masks</h4>
                        <p>ACLs use Wildcard Masks (inverse of subnet masks) to identify IP ranges. A 0 dictates an exact match, while a 255 dictates an ignore bit. For a /24 network (Subnet Mask 255.255.255.0), the Wildcard Mask is 0.0.0.255.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 15,
            "name": "Unit 15: Infrastructure Services (DHCP/DNS)",
            "text": "Foundational network services for configuration and resolution.",
            "html": `
                <div class="module-content">
                    <h3>Unit 15: DHCP and DNS</h3>
                    <div class="submodule">
                        <h4>The DHCP DORA Process</h4>
                        <p>Dynamic Host Configuration Protocol handles automatic IP allocation. When a client boots up, it initiates a 4-step Layer 2 broadcast sequence:<br>1. <strong>Discover:</strong> Host shouts "Is there a DHCP server?"<br>2. <strong>Offer:</strong> Server replies "I am a server, here is an IP lease."<br>3. <strong>Request:</strong> Host responds "I accept that lease."<br>4. <strong>Acknowledge:</strong> Server confirms the lease in its database.<br>If the server resides on a different VLAN, an <em>IP Helper Address</em> (DHCP Relay) must be configured on the local router interface to forward the broadcast as a unicast packet.</p>
                    </div>
                    <div class="submodule">
                        <h4>Domain Name System (DNS)</h4>
                        <p>DNS (UDP Port 53) translates human-readable domain names (nuc7.com) into machine-routable IP addresses. It uses a globally distributed, hierarchical database.<br>Essential Record Types:<br><strong>A Record:</strong> Maps a name to an IPv4 address.<br><strong>AAAA Record:</strong> Maps a name to an IPv6 address.<br><strong>CNAME:</strong> Aliases one name to another name.<br><strong>MX:</strong> Directs email routing.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 16,
            "name": "Unit 16: System Management",
            "text": "Managing network devices: SNMP, Syslog, and NTP.",
            "html": `
                <div class="module-content">
                    <h3>Unit 16: Diagnostics & Telemetry</h3>
                    <div class="submodule">
                        <h4>SNMP (Simple Network Management Protocol)</h4>
                        <p>SNMP operates over UDP 161/162. An NMS (Network Management System) polls agents running on routers and switches for telemetry (CPU, interface bandwidth) using OIDs. <strong>SNMPv3</strong> is critical as it introduces hardware-level encryption and robust authentication, whereas SNMPv2 sent community strings in cleartext, posing extreme security risks.</p>
                    </div>
                    <div class="submodule">
                        <h4>Syslog Levels</h4>
                        <p>Networking devices centralize their logs via Syslog (UDP 514). Logs are generated with severity levels, ranging from 0 (Emergencies: System unusable) down through 3 (Errors), 6 (Informational), to 7 (Debugging). Collecting logs into a SIEM server is fundamental for forensic analysis and alerting.</p>
                    </div>
                    <div class="submodule">
                        <h4>NTP (Network Time Protocol)</h4>
                        <p>Accurate time synchronization across all infrastructure is critical for Syslog correlation and cryptography (like IPsec certificates). NTP uses UDP 123 to synchronize clocks against high-stratum atomic clocks. Stratum 1 servers are connected directly to hardware clocks; Stratum 2 gets time from Stratum 1, etc.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 17,
            "name": "Unit 17: Quality of Service (QoS)",
            "text": "Prioritizing critical traffic across the network.",
            "html": `
                <div class="module-content">
                    <h3>Unit 17: Quality of Service</h3>
                    <div class="submodule">
                        <h4>The Need for QoS</h4>
                        <p>When network bandwidth is congested, packets are dropped. A dropped Web (TCP) packet is fine—TCP will simply retransmit. A dropped or delayed VoIP (UDP Voice) packet results in jagged audio. QoS ensures real-time, delay-sensitive traffic survives times of extreme network congestion.</p>
                    </div>
                    <div class="submodule">
                        <h4>Classification and Marking</h4>
                        <p>QoS works by identifying traffic types (Classification) and applying a label to the packet header (Marking). For Layer 3 IP packets, the ToS byte is altered using DSCP (Differentiated Services Code Point). For example, Voice is universally marked with DSCP EF (Expedited Forwarding, value 46). Data is marked as Best Effort (0).</p>
                    </div>
                    <div class="submodule">
                        <h4>Queuing and Shaping</h4>
                        <p>As packets leave a router interface, QoS policies intercept them. <strong>CBWFQ</strong> (Class-Based Weighted Fair Queuing) guarantees a percentage of bandwidth to certain traffic classes. <strong>LLQ</strong> (Low Latency Queuing) goes further by injecting Voice traffic into a strict priority queue, ensuring it skips the line entirely. <strong>Shaping</strong> buffers excess traffic to prevent provider policing drops.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 18,
            "name": "Unit 18: Cloud & Architecture",
            "text": "Cloud models and Software Defined Networking (SDN).",
            "html": `
                <div class="module-content">
                    <h3>Unit 18: Cloud & Architecture</h3>
                    <div class="submodule">
                        <h4>Cloud Deployment Models</h4>
                        <p><strong>IaaS (Infrastructure as a Service):</strong> You manage the OS and apps (e.g., AWS EC2 VMs).<br><strong>PaaS (Platform as a Service):</strong> The vendor manages OS/Hardware; you focus purely on deploying code and apps.<br><strong>SaaS (Software as a Service):</strong> Vendor provides the fully functioning software via browser (e.g., Office 365, Salesforce).</p>
                    </div>
                    <div class="submodule">
                        <h4>Traditional vs SDN Architecture</h4>
                        <p>Traditionally, every router has its own Data Plane (forwarding traffic) and Control Plane (making routing decisions). This means configuring 500 routers requires managing 500 individual control planes.<br><br><strong>Software-Defined Networking (SDN)</strong> decouples these planes. It moves the "brain" (Control Plane) to a centralized SDN Controller. The routers become dumb forwarding switches relying on the API of the controller. This allows administrators to deploy global network policies instantly from a single dashboard (e.g., Cisco DNA Center).</p>
                    </div>
                    <div class="submodule">
                        <h4>APIs (Application Programming Interfaces)</h4>
                        <p>In SDN, Southbound APIs connect the Controller down to the network hardware (using NETCONF or OpenFlow). Northbound APIs connect the Controller up to graphical applications, Python scripts, or orchestration tools running on the admin's machine, usually via RESTful APIs.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 19,
            "name": "Unit 19: Network Automation",
            "text": "Python, Ansible, and Data Formats in modern networking.",
            "html": `
                <div class="module-content">
                    <h3>Unit 19: Network Automation</h3>
                    <div class="submodule">
                        <h4>Data Formats (JSON vs XML vs YAML)</h4>
                        <p>When a Python script asks an SDN controller for network data via an API, the response isn't human CLI output—it's structured data.<br><strong>JSON:</strong> Uses key/value pairs enclosed in curly braces. Highly popular for REST APIs. {"interface": "Gig0/1", "status": "up"}<br><strong>XML:</strong> Uses strictly nested tags similar to HTML. Often used in NETCONF.<br><strong>YAML:</strong> Uses clean human-readable text heavily reliant on strict indentation. The standard for Ansible Playbooks.</p>
                    </div>
                    <div class="submodule">
                        <h4>Configuration Management Tools</h4>
                        <p><strong>Ansible:</strong> An agentless tool that uses SSH to push YAML Playbooks describing the "desired state" of the network endpoints. Extremely popular due to its simplicity and imperative logic.<br><strong>Puppet/Chef:</strong> Agent-based tools requiring software installed on target nodes, handling continuous monitoring and state convergence.</p>
                    </div>
                    <div class="submodule">
                        <h4>Python in Networking</h4>
                        <p>Python is the scripting language of choice for network engineering. Libraries like <strong>Netmiko</strong> allow SSH CLI automation against legacy hardware. The <strong>Requests</strong> library is widely used to interact natively with modern HTTP/REST APIs provided by SDN controllers like Cisco Meraki or DNA Center.</p>
                    </div>
                </div>
            `
        },
        {
            "id": 20,
            "name": "Unit 20: Network Design Principles",
            "text": "Campus design, Spine & Leaf, and Overlay networks.",
            "html": `
                <div class="module-content">
                    <h3>Unit 20: Network Design</h3>
                    <div class="submodule">
                        <h4>Cisco 3-Tier Hierarchical Model</h4>
                        <p>A structured approach to campus LAN design:<br><strong>Core Layer:</strong> The high-speed backbone. Focuses solely on fast switching, with zero QoS polishing or ACL processing.<br><strong>Distribution Layer:</strong> The aggregator. Where routing, security (ACLs), and QoS policies are implemented. Isolates broadcast domains.<br><strong>Access Layer:</strong> The edge. Where end-user devices (PCs, APs) connect to the network. Where PortFast and port security are applied.</p>
                    </div>
                    <div class="submodule">
                        <h4>Collapsed Core Architecture</h4>
                        <p>For small to medium campuses, the Core and Distribution layers are merged into a single pair of powerful multilayer switches to reduce physical hardware costs while maintaining logical redundancy.</p>
                    </div>
                    <div class="submodule">
                        <h4>Spine-and-Leaf Architecture (Data Centers)</h4>
                        <p>Traditional 3-tier models fail in modern Data Centers because East-West traffic (Server-to-Server) creates bottlenecks moving up and down the tree. A Spine-Leaf topology connects every Leaf switch to every Spine switch. This guarantees that any server is exactly identically distant from any other server (1 hop up, 1 hop down), ensuring consistently predictable low latency for intense storage and compute clustering.</p>
                    </div>
                    <div class="submodule">
                        <h4>Underlay vs Overlay Networks</h4>
                        <p><strong>Underlay:</strong> The physical switches, cables, and routing protocols (OSPF/BGP) strictly providing IP connectivity between devices.<br><strong>Overlay:</strong> A logical, virtualized topology built *on top* of the underlay using tunneling protocols like VXLAN. This allows Layer 2 frames to be encapsulated in UDP packets, effectively stretching a single VLAN logically across vast geographic Layer 3 networks without risking Spanning Tree loops.</p>
                    </div>
                </div>
            `
        }
    ]
};
