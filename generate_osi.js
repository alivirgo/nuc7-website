const fs = require('fs');

const layers = [
  {
    id: 1,
    name: "Layer 1: The Physical Layer",
    text: "The foundation of all communication. It deals with raw bits (0s and 1s) and physical hardware.",
    html: `
      <h3>Welcome to the Physical Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Physical Layer is the lowest layer of the OSI model, representing the actual physical hardware and transmission technologies of a network. It provides mechanical, electrical, and other functional aids to transmit raw bits across a physical medium.
      </p>
      
      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #4a90e2;">
        <h4 style="margin-bottom: 1rem; color: #4a90e2;">The Main Analogy: The Infrastructure</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          Think of the physical layer as the roads, electrical lines, or railroad tracks connecting cities. The shapes of connectors, frequencies to broadcast on, and modulation schemes are specified here. Whether you use a copper cable, fiber-optic light, or electromagnetic waves (wireless), the physical layer makes it happen.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Transmission of Bits:</strong> Bit-by-bit or symbol-by-symbol delivery across wired or wireless paths.</li>
        <li><strong>Physical Aspects:</strong> Deals with electrical signals, optical signals (laser/fiber), electromagnetic waves, line coding, and bit synchronization.</li>
        <li><strong>Network Topology:</strong> Defines whether the network is a bus, ring, mesh, or star setup.</li>
        <li><strong>Hardware Devices:</strong> Includes cables, plugs, repeaters, hubs, network adapters, amplifiers, and transceivers.</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(0, 150, 255, 0.05); border: 1px solid rgba(0, 150, 255, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #4a90e2; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: The Chaos of Layer 1</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            <strong>Did you know?</strong> Because Layer 1 has zero intelligence, it cannot stop a "Collision." If two devices on an old coaxial cable send voltage at the exact same millisecond, the signals crash and corrupt each other. It's up to higher layers (like Layer 2) to detect this physical chaos and re-transmit! Layer 1 is simply the silent workhorse of the internet.
          </p>
      </div>
    `
  },
  {
    id: 2,
    name: "Layer 2: The Data Link Layer",
    text: "Giving bits meaning. The Data Link layer organizes data into frames and handles local delivery.",
    html: `
      <h3>Welcome to the Data Link Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Data Link Layer ensures reliable, largely error-free transmission between adjacent network nodes. It divides raw bits into blocks called <strong>Frames</strong> and handles media access control (MAC).
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #4ade80;">
        <h4 style="margin-bottom: 1rem; color: #4ade80;">The Main Analogy: The Local Neighborhood Cop</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          The Data Link layer acts like a neighborhood traffic cop, arbitrating between parties contending for access to a medium without concern for their ultimate, global destination. It focuses strictly on local delivery within a LAN or WAN segment.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>MAC Addressing:</strong> Uses physical addressing to ensure data reaches the correct recipient on the same local network.</li>
        <li><strong>Framing & Sync:</strong> Encapsulates data into frames, adding checksums for channel coding. If a frame is corrupt, it is detected and dropped.</li>
        <li><strong>Logical Link & Flow Control:</strong> Dynamically controls sending speeds to prevent overwhelming a receiver and specifies how devices detect and recover from collisions.</li>
        <li><strong>Hardware & Protocols:</strong> Network Switches (multiport bridges) and Bridges operate here. Common protocols are Ethernet, PPP, and HDLC. It also handles VLANs.</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(74, 222, 128, 0.05); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #4ade80; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: MAC Addresses & Switch Magic</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            A MAC Address (Media Access Control) is a unique, 12-character hexadecimal identifier burned directly into your device's network card by the manufacturer. Unlike a hub that blindly screams data to everyone, a Layer 2 <strong>Switch</strong> memorizes the MAC addresses of everything plugged into it. When it receives a frame, it intelligently forwards it <em>only</em> to the correct port. This eliminates the collisions that plague Layer 1!
          </p>
      </div>
    `
  },
  {
    id: 3,
    name: "Layer 3: The Network Layer",
    text: "Routing and global reach. The network layer gets your data across the world using IP Addresses.",
    html: `
      <h3>Welcome to the Network Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Network Layer is responsible for packet forwarding and routing through intermediate routers. It provides cross-network addresses and manages Quality of Service (QoS) to establish global reach between a source and a destination host.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #f87171;">
        <h4 style="margin-bottom: 1rem; color: #f87171;">The Main Analogy: The Global Postal System</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          When you send a message, it rarely goes straight to the exact target. Routers look at the destination IP address, search their routing tables, and forward the packet step-by-step (hop-by-hop) across the world until it reaches the destination network.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Host Addressing:</strong> Uses logical addresses like IPv4 and IPv6 to give every host a unique, cross-network identity.</li>
        <li><strong>Routing & Forwarding:</strong> Builds and updates routing tables to actively forward discrete packets through the best possible path.</li>
        <li><strong>Fragmentation:</strong> Can fragment data packets if the underlying Layer 2 frame size is too small for a full packet.</li>
        <li><strong>Protocols:</strong> IP (v4/v6), ICMP (for pings), RIP, OSPF, and BGP.</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(248, 113, 113, 0.05); border: 1px solid rgba(248, 113, 113, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #f87171; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: The Power of IP Addresses</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            A MAC Address (Layer 2) is like your Social Security Number—it identifies <em>who</em> you are physically. An IP Address (Layer 3) is like your mailing address—it identifies <em>where</em> you are logically on the planet. If you move your laptop from your house to a coffee shop, your MAC address stays the same, but your IP address changes so global routers know where to send your network packets!
          </p>
      </div>
    `
  },
  {
    id: 4,
    name: "Layer 4: The Transport Layer",
    text: "End-to-end reliability, multiplexing, and flow control. Sending your data via ports.",
    html: `
      <h3>Welcome to the Transport Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Transport Layer provides the upper application-oriented layers with a standardized interface to the network. It handles host-to-host communication, segmentation, congestion avoidance, and port multiplexing.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #a78bfa;">
        <h4 style="margin-bottom: 1rem; color: #a78bfa;">The Main Analogy: The Certified Courier</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          Imagine trying to send an entire encyclopedia. You break it into numbered segments. At the destination, the Courier sorts it back into order, requests re-transmission for missing pages, and guarantees exact placement. It also assigns "Ports" so the encyclopedia goes to the right desk.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Two Titans (TCP vs UDP):</strong> TCP provides connection-oriented, highly reliable transmission with stateful design and flow control. UDP provides fast, simple, connectionless messaging.</li>
        <li><strong>Port Multiplexing:</strong> Assigns layer 4 addresses (ports) to data segments so a single computer can handle web traffic, emails, and gaming simultaneously.</li>
        <li><strong>Reliability & Order:</strong> Guarantees the same order of delivery and solves transmission bottlenecks with congestion avoidance.</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(167, 139, 250, 0.05); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #a78bfa; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: TCP vs UDP</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            <strong>TCP</strong> is like ordering a package with certified signature tracking. Before data is sent, a 3-way handshake (SYN, SYN-ACK, ACK) establishes a connection to guarantee the receiver is ready. If a piece goes missing, TCP requests it again. <br><br><strong>UDP</strong> is like throwing a postcard in the mailbox. It's incredibly fast because there's no handshake or tracking overhead. You use UDP when speed matters more than perfection—like in live video streaming or real-time gaming!
          </p>
      </div>
    `
  },
  {
    id: 5,
    name: "Layer 5: The Session Layer",
    text: "Keeping the conversation organized. The Session layer builds, controls, and synchronizes dialogues.",
    html: `
      <h3>Welcome to the Session Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Session Layer provides a mechanism for opening, closing, and managing a "session" between end-user application processes. It handles the organized and synchronized data exchange that makes up an ongoing dialogue.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #fbbf24;">
        <h4 style="margin-bottom: 1rem; color: #fbbf24;">The Main Analogy: The Telephone Operator / Secretary</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          Like a secretary managing a difficult meeting, it determines who is allowed to talk and when (full-duplex vs half-duplex), tracks authentication, and provides fail-safes so the meeting doesn't have to restart entirely if interrupted.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Checkpoints (Synchronization Points):</strong> In a massive file transfer, it introduces recovery points. If a connection fails, it can resume precisely from the checkpoint without starting over.</li>
        <li><strong>Security & State:</strong> Manages Authentication, Authorization, and Session Restoration.</li>
        <li><strong>Protocols:</strong> RPC (Remote Procedure Call), SCP, and ZIP (Zone Information Protocol).</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #fbbf24; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: The Unsung Hero</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            In modern networks, the Session, Presentation, and Application layers are often grouped together entirely into the TCP/IP "Application Layer." However, understanding Layer 5 is critical. Think about downloading a massive 50GB video game over Wi-Fi. If your router restarts at 49GB, you wouldn't want to start from 0GB again. The Session Layer's "Checkpoints" guarantee you only lose the data after the final sync point!
          </p>
      </div>
    `
  },
  {
    id: 6,
    name: "Layer 6: The Presentation Layer",
    text: "Formatting, decoding, and encryption. Assuring data syntax and semantics are shared.",
    html: `
      <h3>Welcome to the Presentation Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Presentation Layer sets the system-dependent representation of data into an independent, universal form. It relieves the application layer of syntax differences between end-user systems, enabling smooth exchanges regardless of underlying architecture.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #2dd4bf;">
        <h4 style="margin-bottom: 1rem; color: #2dd4bf;">The Main Analogy: The Universal Translator & Encryptor</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          If an obsolete mainframe speaks EBCDIC and a modern PC speaks ASCII, Layer 6 translates it. If a bank app requires secrecy, Layer 6 encrypts it before sending and decrypts when receiving. It standardizes the dialect.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Data Conversion & Formatting:</strong> Deals with string representation, character coding, and serialization of complex data structures (like XML, JSON, or ASN.1).</li>
        <li><strong>Security:</strong> The prime location for Encryption and Decryption (like TLS/SSL for secure banking).</li>
        <li><strong>Compression:</strong> Squeezes data down for more efficient transit.</li>
        <li><strong>Sublayers:</strong> Composed of CASE (Common Application Service Element) and SASE (Specific Application Service Element).</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(45, 212, 191, 0.05); border: 1px solid rgba(45, 212, 191, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #2dd4bf; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: The Translator</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            Without the Presentation Layer, the internet would be highly fragmented. Imagine a developer writing a game server in C++ and a web dashboard in JavaScript. These languages store data very differently in memory. Layer 6 forces them to agree on a universal syntax (like JSON or XML) to ensure that when the server says "Health: 100", the web dashboard actually understands it!
          </p>
      </div>
    `
  },
  {
    id: 7,
    name: "Layer 7: The Application Layer",
    text: "The Top Level API. The layer providing user-interface elements and top-level services.",
    html: `
      <h3>Welcome to the Application Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Application Layer is the top abstraction layer. While TCP/IP views this broadly, the OSI model specifically defines it as the user interface responsible for bringing network services to the applications. It doesn't contain the application itself (like Chrome), but rather the actual network protocols the app relies on.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #f472b6;">
        <h4 style="margin-bottom: 1rem; color: #f472b6;">The Main Analogy: The Network Interface</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          It is the doorway through which humans and software enter the network. Here is where your web browser speaks HTTP to fetch a website, or your mail client speaks SMTP to send an email. You interact directly with the fruits of Layer 7.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Process-to-Process:</strong> Standardizes communications used by internet hosts and handles data input/output.</li>
        <li><strong>Services:</strong> Web browsing, application networking, network management, and file transfers.</li>
        <li><strong>Prominent Protocols:</strong> HTTP/HTTPS, FTP, SMTP/POP3/IMAP, and DNS.</li>
      </ul>

      <div style="margin-top: 3rem; padding: 2rem; background: rgba(244, 114, 182, 0.05); border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 12px; position: relative;">
          <div style="position: absolute; top: -15px; left: 20px; background: #000; padding: 0 10px; color: #f472b6; font-weight: 600; font-size: 0.9rem; text-transform: uppercase;">Info Pack: The Layer 8 Problem</div>
          <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0;">
            A widespread misconception is that Layer 7 <em>is</em> the software (like Google Chrome or Outlook). Not quite! The software is what the user interacts with, but Layer 7 is the underlying protocol (HTTP or SMTP) that the software uses to reach the network. In IT, when a user makes a mistake trying to use the software, engineers jokingly refer to this as a <strong>Layer 8 Issue</strong> (User Error).
          </p>
      </div>
    `
  }
];

fs.writeFileSync('course_data.js', 'const layers = ' + JSON.stringify(layers, null, 2) + ';');
console.log('Successfully drafted heavily expanded OSI course curriculum based on osi-model.com to course_data.js');
