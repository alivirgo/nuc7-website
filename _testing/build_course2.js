const fs = require('fs');
const text = fs.readFileSync('extracted_text.txt', 'utf8');

const modulesKeywords = [
    "OSI Network Layer",
    "Network Layer: Communication from Host to Host",
    "Network Layer Protocols",
    "Networks: Dividing Hosts into Groups",
    "Routing: How Data Packets Are Handled",
    "Routing Processes: How Routes Are Learned"
];

let outModules = [];
let currentModuleId = 0;
let currentHtml = "";

const lines = text.split('\n');
let currentPage = 1;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    const pageMatch = line.match(/^--- PAGE (\d+) ---$/);
    if (pageMatch) {
        currentPage = parseInt(pageMatch[1]);
        continue;
    }

    if (line.includes('Network Fundamentals, CCNA Exploration Companion Guide') ||
        line.match(/^Chapter \d+: OSI Network Layer\s*\d+$/)) {
        continue;
    }

    let isNewModule = false;
    for (let k = currentModuleId; k < modulesKeywords.length; k++) {
        if (line === modulesKeywords[k] || line.includes(modulesKeywords[k])) {
            if (currentModuleId > 0 || currentHtml.length > 0) {
                outModules.push({
                    id: currentModuleId || 1,
                    name: currentModuleId > 0 ? modulesKeywords[currentModuleId - 1] : "Introduction",
                    text: "Module " + (currentModuleId || 1),
                    html: currentHtml
                });
            }
            currentModuleId = k + 1;
            currentHtml = "";
            isNewModule = true;
            break;
        }
    }
    if (isNewModule) continue;

    const figMatch = line.match(/Figure 5-\d+/);
    if (line.length < 60 && !line.includes('.')) {
        currentHtml += `<h3>${line}</h3>`;
    } else {
        currentHtml += `<p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">${line}</p>`;
    }

    if (figMatch) {
        currentHtml += `<div style="text-align:center; margin: 2rem 0;"><img src="extracted_page_${currentPage}.jpg" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" alt="${figMatch[0]}"></div>`;
    }
}

if (currentHtml.length > 0) {
    outModules.push({
        id: currentModuleId || 1,
        name: currentModuleId > 0 ? modulesKeywords[currentModuleId - 1] : "Final Module",
        text: "Module " + (currentModuleId || 1),
        html: currentHtml
    });
}

// Ensure IDs are sequential
outModules.forEach((m, idx) => m.id = idx + 1);

fs.writeFileSync('course_data.js', 'const layers = ' + JSON.stringify(outModules, null, 2) + ';');
console.log("Wrote course_data.js with length", outModules.length);
