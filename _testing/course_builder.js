/**
 * NUC7 Course Builder Agent
 * 
 * Usage: node course_builder.js <course-id> "<Course Title>" <certificate-bg.png>
 * 
 * This script generates a template data file and updates course_registry.js
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node course_builder.js <course-id> "<Course Title>" <certificate-bg.png>');
    process.exit(1);
}

const [courseId, courseTitle, certBg] = args;
const dataVar = courseId.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) + 'Data';
const scriptName = `${courseId.replace(/-/g, '_')}_data.js`;

const template = `var ${dataVar} = {
    id: "${courseId}",
    title: "${courseTitle}",
    certificateBg: "${certBg}",
    layers: [
        {
            "id": 1,
            "name": "Module 1: Introduction",
            "text": "Welcome to ${courseTitle}. This is your first step into mastery.",
            "html": \`
                <h3>Module Overview</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    Start building your course content here. Use semantic HTML and CSS variables like var(--text-secondary).
                </p>
            \`
        }
    ]
};
`;

// 1. Create Data File
fs.writeFileSync(path.join(__dirname, scriptName), template);
console.log(`[PASS] Created ${scriptName}`);

// 2. Update Registry
const registryPath = path.join(__dirname, 'course_registry.js');
let registryContent = fs.readFileSync(registryPath, 'utf8');

const newEntry = `    "${courseId}": {
        script: "${scriptName}",
        dataVar: "${dataVar}",
        certificateBg: "${certBg}",
        seo: { title: "NUC7 | ${courseTitle}" }
    },
};`;

// Replace the closing brace of the registry object with the new entry
registryContent = registryContent.trim().replace(/\};$/, newEntry);

fs.writeFileSync(registryPath, registryContent);
console.log(`[PASS] Updated course_registry.js`);

console.log(`\nSuccess! New course "${courseTitle}" initialized.`);
console.log(`Next Steps:`);
console.log(`1. Edit ${scriptName} to add modules.`);
console.log(`2. Update index.html to feature the new course.`);
