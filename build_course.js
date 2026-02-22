const fs = require('fs');
const text = fs.readFileSync('extracted_text.txt', 'utf8');

const modules = [
    { name: "OSI Network Layer Introduction", keywords: ["OSI Network Layer", "Objectives", "Key Terms"] },
    { name: "Communication from Host to Host", keywords: ["Network Layer: Communication from Host to Host", "Encapsulation", "Routing", "Decapsulation"] },
    { name: "Network Layer Protocols", keywords: ["Network Layer Protocols", "IPv4: Example Network Layer Protocol"] },
    { name: "Networks: Dividing Hosts into Groups", keywords: ["Networks: Dividing Hosts into Groups", "Creating Common Groups"] },
    { name: "Routing: How Data Packets Are Handled", keywords: ["Routing: How Data Packets Are Handled", "Gateway: The Way Out", "Route: A Path"] },
    { name: "Routing Processes: How Routes Are Learned", keywords: ["Routing Processes: How Routes Are Learned", "Static Routing", "Dynamic Routing"] }
];

let currentModule = 0;
let outModules = [
    { id: 1, name: "OSI Network Layer Introduction", html: "", text: "Overview of the OSI Network Layer and routing concepts." }
];

const lines = text.split('\n');
let currentPage = 1;

const ignoredLinesRegex = /^(Chapter \d+[:\.]|.*Network Fundamentals, CCNA Exploration Companion Guide)|(\s*\d+\s*Network Fundamentals)|\b\d+\s*$/i;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Track page
    const pageMatch = line.match(/^--- PAGE (\d+) ---$/);
    if (pageMatch) {
        currentPage = parseInt(pageMatch[1]);
        continue;
    }

    // Ignore headers and footers
    if (line.includes('Network Fundamentals, CCNA Exploration Companion Guide') ||
        line.match(/^Chapter \d+: OSI Network Layer\s*\d+$/)) {
        continue;
    }

    // Check if we switch modules
    if (currentModule < modules.length - 1) {
        const nextModule = modules[currentModule + 1];
        if (line.includes(nextModule.keywords[0])) {
            currentModule++;
            outModules.push({
                id: currentModule + 1,
                name: nextModule.name,
                html: "",
                text: "Deep dive into " + nextModule.name
            });
            continue;
        }
    }

    // Append to current module
    // Detect Figure to insert Image
    const figMatch = line.match(/Figure 5-\d+/);

    // Add paragraph
    if (line.length < 60 && !line.includes('.')) {
        outModules[currentModule].html += `<h3>${line}</h3>`;
    } else {
        outModules[currentModule].html += `<p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">${line}</p>`;
    }

    if (figMatch) {
        // Find which page this image corresponds to
        // Because the page image includes the whole page, we can show it as an illustration.
        // The images are extracted_page_X.jpg
        outModules[currentModule].html += `<div style="text-align:center; margin: 2rem 0;"><img src="extracted_page_${currentPage}.jpg" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" alt="${figMatch[0]}"></div>`;
    }
}

fs.writeFileSync('course_data.json', JSON.stringify(outModules, null, 2));
console.log("Wrote course_data.json");
