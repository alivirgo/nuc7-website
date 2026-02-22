const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('publication_4_20245_670.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('extracted_text.txt', data.text);
    console.log("Extracted text successfully.");
}).catch(err => {
    console.error("Error extracting text:", err);
});
