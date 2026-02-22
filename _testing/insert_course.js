const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');
const jsData = fs.readFileSync('course_data.js', 'utf8');

// Replace the const layers = [ ... ]; block
html = html.replace(/const layers = \[\s*\{[\s\S]*?\}\s*\];/, jsData);

// Update show function placeholder
html = html.replace(
    /<p style="color: var\(--text-secondary\); font-size: 0\.95rem;">\[Comprehensive curriculum content for \$\{l\.name\} will be expanded here based on vault data\.\]<\/p>/,
    '${l.html}'
);

// Update the next button logic to use layers.length
html = html.replace(
    /\$\{id < 7 \? `<button class="cta-btn"/,
    '${id < layers.length ? `<button class="cta-btn"'
);

fs.writeFileSync('course.html', html);
console.log('Successfully injected into course.html');
