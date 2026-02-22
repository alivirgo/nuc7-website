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
                        <p>Networking is the practice of transporting and exchanging data between nodes over a shared medium in an information system. It's the backbone of the digital age, enabling everything from simple file sharing to complex cloud computing.</p>
                    </div>
                    <div class="submodule">
                        <h4>Network Topologies</h4>
                        <p>Topologies define the layout of a network. Primary physical topologies include:</p>
                        <ul>
                            <li><strong>Star:</strong> All nodes connect to a central hub (most common in modern LANs).</li>
                            <li><strong>Mesh:</strong> Nodes are interconnected, providing high redundancy.</li>
                            <li><strong>Bus:</strong> All nodes share a single communication line (legacy).</li>
                        </ul>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to the OSI Model</h4>
                        <p>The 7-layer model (Physical to Application) provides a standardized framework for network communication.</p>
                    </div>
                    <div class="submodule">
                        <h4>TCP/IP Stack Tutorial</h4>
                        <p>The 4-layer functional model (Network Access, Internet, Transport, Application) that actually runs the internet.</p>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to LANs</h4>
                        <p>Local Area Networks connect devices in a limited geographical area like a home or office.</p>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to Ethernet</h4>
                        <p>The dominant wired LAN technology, using MAC addresses for local delivery.</p>
                    </div>
                    <div class="submodule">
                        <h4>Collision Domain</h4>
                        <p>A section of a network where data packets can collide with one another when being sent on a shared medium.</p>
                    </div>
                    <div class="submodule">
                        <h4>Broadcast Domain</h4>
                        <p>The logical part of a network where all nodes can reach each other by broadcast at the data link layer.</p>
                    </div>
                    <div class="submodule">
                        <h4>How to take Networking Notes</h4>
                        <p>Use diagrams, track protocols by layer, and maintain a glossary of acronyms.</p>
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
                        <p>A 32-bit hierarchical address identifying hosts and networks.</p>
                    </div>
                    <div class="submodule">
                        <h4>IPv4 Packet Header</h4>
                        <p>Contains source/destination IPs, TTL, Protocol, and Header Checksum.</p>
                    </div>
                    <div class="submodule">
                        <h4>Basics of Binary Numbers</h4>
                        <p>Networking runs on Base-2. Mastering the 128-64-32-16-8-4-2-1 bit positions is critical.</p>
                    </div>
                    <div class="submodule">
                        <h4>Hexadecimal to Decimal and Binary</h4>
                        <p>Essential for IPv6 and MAC address comprehension.</p>
                    </div>
                    <div class="submodule">
                        <h4>What is Subnetting?</h4>
                        <p>Dividing a large network into smaller segments for efficiency and security.</p>
                    </div>
                    <div class="submodule">
                        <h4>Variable Length Subnet Mask (VLSM)</h4>
                        <p>Allows for subnets of different sizes, reducing IP wastage.</p>
                    </div>
                    <div class="submodule">
                        <h4>Classless InterDomain Routing (CIDR)</h4>
                        <p>Replaced the old A/B/C classes with prefix-length notation (e.g., /24).</p>
                    </div>
                    <div class="submodule">
                        <h4>ARP (Address Resolution Protocol)</h4>
                        <p>Translates IP addresses to MAC addresses for Layer 2 delivery.</p>
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
                        <h4>Introduction to IPv6</h4>
                        <p>A 128-bit address space providing virtually unlimited addresses.</p>
                    </div>
                    <div class="submodule">
                        <h4>IPv6 Address Types</h4>
                        <p>Unicast, Multicast, and Anycast. Note: There is no Broadcast in IPv6.</p>
                    </div>
                    <div class="submodule">
                        <h4>IPv6 EUI-64 Explained</h4>
                        <p>Generating a 64-bit interface ID from a 48-bit MAC address.</p>
                    </div>
                    <div class="submodule">
                        <h4>Stateless Autoconfiguration (SLAAC)</h4>
                        <p>Nodes assign themselves addresses using Router Advertisements.</p>
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
                        <h4>Introduction to TCP and UDP</h4>
                        <p>TCP (Reliable, connection-oriented) vs UDP (Fast, connectionless).</p>
                    </div>
                    <div class="submodule">
                        <h4>TCP Header</h4>
                        <p>Includes sequence numbers, acknowledgements, and windowing.</p>
                    </div>
                    <div class="submodule">
                        <h4>ICMP</h4>
                        <p>Control plane protocol used for management and diagnostics (e.g., Ping, Traceroute).</p>
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
                        <h4>MAC Address Learning</h4>
                        <p>Switches build a CAM table based on source MACs of incoming frames.</p>
                    </div>
                    <div class="submodule">
                        <h4>Introduction to VLANs</h4>
                        <p>Logical segmentation of a switch into multiple broadcast domains.</p>
                    </div>
                    <div class="submodule">
                        <h4>Trunking & 802.1Q</h4>
                        <p>Passing multiple VLANs over a single link using Frame Tagging.</p>
                    </div>
                    <div class="submodule">
                        <h4>InterVLAN Routing</h4>
                        <p>Moving traffic between VLANs using a Router (Router-on-a-Stick) or Layer 3 Switch.</p>
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
                        <h4>Introduction to Spanning Tree</h4>
                        <p>802.1D standard that blocks redundant paths to prevent broadcast storms.</p>
                    </div>
                    <div class="submodule">
                        <h4>Port States</h4>
                        <p>Blocking, Listening, Learning, Forwarding, and Disabled.</p>
                    </div>
                    <div class="submodule">
                        <h4>Rapid Spanning Tree (RSTP)</h4>
                        <p>802.1w enhancement for faster convergence (Discarding, Learning, Forwarding).</p>
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
                    <h3>Unit 7: EtherChannel</h3>
                    <div class="submodule">
                        <h4>EtherChannel Concepts</h4>
                        <p>Grouping multiple physical links into one logical bundle (LACP/PAgP).</p>
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
                        <h4>IP Routing Explained</h4>
                        <p>The process of forwarding packets across network boundaries based on Layer 3 addresses.</p>
                    </div>
                    <div class="submodule">
                        <h4>Administrative Distance</h4>
                        <p>The trustworthiness of a routing source (Connected: 0, Static: 1, OSPF: 110).</p>
                    </div>
                </div>
            `
        },
        {
            "id": 9,
            "name": "Unit 9: OSPF",
            "text": "Open Shortest Path First - An industry standard link-state protocol.",
            "html": `
                <div class="module-content">
                    <h3>Unit 9: OSPF</h3>
                    <p>Hierarchical routing using Areas. Area 0 is the backbone.</p>
                </div>
            `
        },
        {
            "id": 10,
            "name": "Unit 10: EIGRP",
            "text": "Enhanced Interior Gateway Routing Protocol.",
            "html": `
                <div class="module-content">
                    <h3>Unit 10: EIGRP</h3>
                    <p>Advanced distance vector protocol using the DUAL algorithm.</p>
                </div>
            `
        },
        {
            "id": 11,
            "name": "Unit 11: First Hop Redundancy",
            "text": "Gateway redundancy using HSRP, VRRP, and GLBP.",
            "html": `
                <div class="module-content">
                    <h3>Unit 11: FHRP</h3>
                    <p>Ensuring clients have a highly available default gateway.</p>
                </div>
            `
        },
        {
            "id": 12,
            "name": "Unit 12: WAN Technologies",
            "text": "Connecting over long distances: HDLC, PPP, and GRE.",
            "html": `
                <div class="module-content">
                    <h3>Unit 12: WAN Technologies</h3>
                    <p>Tunneling and point-to-point encapsulations.</p>
                </div>
            `
        },
        {
            "id": 13,
            "name": "Unit 13: NAT & PAT",
            "text": "Network Address Translation and Port Address Translation.",
            "html": `
                <div class="module-content">
                    <h3>Unit 13: NAT & PAT</h3>
                    <p>Conserving IPv4 address space by mapping private IPs to public IPs.</p>
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
                    <p>Filtering traffic based on protocol, port, or address.</p>
                </div>
            `
        },
        {
            "id": 15,
            "name": "Unit 15: DHCP and DNS",
            "text": "Foundational network services for configuration and resolution.",
            "html": `
                <div class="module-content">
                    <h3>Unit 15: DHCP and DNS</h3>
                    <p>Dynamic addressing and name resolution services.</p>
                </div>
            `
        },
        {
            "id": 16,
            "name": "Unit 16: System Management",
            "text": "Managing network devices: SNMP, Syslog, and NTP.",
            "html": `
                <div class="module-content">
                    <h3>Unit 16: System Management</h3>
                    <p>Monitoring, logging, and time synchronization.</p>
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
                    <p>Classification, marking, and queuing for delay-sensitive data.</p>
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
                    <p>Evolving from on-premise hardware to virtualized infrastructure.</p>
                </div>
            `
        },
        {
            "id": 19,
            "name": "Unit 19: Network Automation",
            "text": "Python, Ansible, and AI in modern networking.",
            "html": `
                <div class="module-content">
                    <h3>Unit 19: Network Automation</h3>
                    <p>Programmatic network management and machine learning integration.</p>
                </div>
            `
        },
        {
            "id": 20,
            "name": "Unit 20: Network Design",
            "text": "Campus design, Spine & Leaf, and Overlay networks.",
            "html": `
                <div class="module-content">
                    <h3>Unit 20: Network Design</h3>
                    <p>Architecting scalable and resilient network topologies.</p>
                </div>
            `
        }
    ]
};
