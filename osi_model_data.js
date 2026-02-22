var osiModelData = {
  id: "osi-model",
  title: "OSI Model Mastery",
  certificateBg: "nameXX.png",
  layers: [
    {
      "id": 1,
      "name": "Layer 1: The Physical Layer",
      "text": "The foundation of all communication. It deals with raw bits (0s and 1s) and physical hardware.",
      "html": `
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
    `
    },
    {
      "id": 2,
      "name": "Layer 2: The Data Link Layer",
      "text": "Giving bits meaning. The Data Link layer organizes data into frames and handles local delivery.",
      "html": `
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
    `
    },
    {
      "id": 3,
      "name": "Layer 3: The Network Layer",
      "text": "Routing and global reach. The network layer gets your data across the world using IP Addresses.",
      "html": `
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
    `
    },
    {
      "id": 4,
      "name": "Layer 4: The Transport Layer",
      "text": "End-to-end reliability, multiplexing, and flow control. Sending your data via ports.",
      "html": `
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
    `
    },
    {
      "id": 5,
      "name": "Layer 5: The Session Layer",
      "text": "Managing dialogues. The session layer handles connections between applications.",
      "html": `
      <h3>Welcome to the Session Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Session Layer manages the setup, coordination, and termination of conversations between applications at each end of a session. It handles session checkpoints and recovery.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #fbbf24;">
        <h4 style="margin-bottom: 1rem; color: #fbbf24;">The Main Analogy: The Zoom Meeting Host</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          The Session layer is like the person hosting a meeting. They make sure the right people are in the room, keep the conversation going, and decide when the meeting is over. If the connection drops, they help everyone get back to where they left off.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Session Establishment & Termination:</strong> Managing the lifecycle of a connection.</li>
        <li><strong>Dialogue Control:</strong> Deciding who talks when (half-duplex or full-duplex).</li>
        <li><strong>Authentication & Authorization:</strong> Basic session-level security checks.</li>
        <li><strong>Checkpointing:</strong> Saving the state of a data transfer.</li>
      </ul>
    `
    },
    {
      "id": 6,
      "name": "Layer 6: The Presentation Layer",
      "text": "Translating data. This layer handles encryption, compression, and data formatting.",
      "html": `
      <h3>Welcome to the Presentation Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Presentation Layer acts as a translator for the network. It ensures that data sent by the application layer of one system can be read by the application layer of another.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #ec4899;">
        <h4 style="margin-bottom: 1rem; color: #ec4899;">The Main Analogy: The Translator</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          If you send a letter in English to someone who only speaks French, you need a translator. The Presentation layer is that translator. It takes the data from the application and turns it into a format the network can understand, and vice versa. It also handles encryption to keep the data safe.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>Data Translation:</strong> EBCDIC to ASCII conversion, for example.</li>
        <li><strong>Encryption & Decryption:</strong> Handling SSL/TLS on some interpretations.</li>
        <li><strong>Compression:</strong> Reducing the size of data for faster transfer.</li>
        <li><strong>Formatting:</strong> Ensuring JPG, MP3, etc., are correctly interpreted.</li>
      </ul>
    `
    },
    {
      "id": 7,
      "name": "Layer 7: The Application Layer",
      "text": "The interface we see. The application layer provides network services directly to users.",
      "html": `
      <h3>Welcome to the Application Layer</h3>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
        The Application Layer is the OSI layer closest to the end user. It provides the interface between the user's application and the network services.
      </p>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #6366f1;">
        <h4 style="margin-bottom: 1rem; color: #6366f1;">The Main Analogy: The Restaurant Menu</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          When you're at a restaurant, you don't go into the kitchen to cook. You use a menu to tell the waiter what you want. The Application layer is that menu. It gives you a way to request things from the network (like a webpage or an email) without needing to know how it's actually made.
        </p>
      </div>

      <h4>Core Services & Functions</h4>
      <ul style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem; padding-left: 1.5rem;">
        <li><strong>User Interface:</strong> Providing the software humans interact with.</li>
        <li><strong>Resource Sharing:</strong> Enabling file transfers and remote access.</li>
        <li><strong>Network Services:</strong> Email (SMTP), Web (HTTP), File Transfer (FTP), Domain Names (DNS).</li>
      </ul>
    `
    }
  ]
};
