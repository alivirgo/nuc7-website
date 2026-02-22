const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        console.log("Launching puppeteer...");
        const browser = await puppeteer.launch({ args: ['--allow-file-access-from-files'] });
        const page = await browser.newPage();

        const fileUrl = `file:///${path.resolve('extractor.html').replace(/\\/g, '/')}`;
        console.log('Loading ' + fileUrl);
        await page.goto(fileUrl, { waitUntil: 'load' });

        console.log("Waiting for extraction to complete...");
        await page.waitForFunction(
            'document.getElementById("status").innerText.includes("Extraction Complete") || document.getElementById("status").innerText.includes("Error")',
            { timeout: 120000 }
        );

        const status = await page.evaluate(() => document.getElementById('status').innerText);
        if (status.includes("Error")) {
            throw new Error(status);
        }

        const extractedText = await page.evaluate(() => document.getElementById('output').value);
        fs.writeFileSync('extracted_text.txt', extractedText);
        console.log('Wrote extracted_text.txt. Length', extractedText.length);

        const images = await page.evaluate(() => {
            const imgs = document.querySelectorAll('#images img');
            return Array.from(imgs).map(img => img.src);
        });

        images.forEach((src, index) => {
            if (src.startsWith('data:image/jpeg;base64,')) {
                const base64Data = src.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFileSync(`extracted_page_${index + 1}.jpg`, base64Data, 'base64');
                console.log(`Wrote extracted_page_${index + 1}.jpg`);
            } else if (src.startsWith('data:image/png;base64,')) {
                const base64Data = src.replace(/^data:image\/png;base64,/, "");
                fs.writeFileSync(`extracted_page_${index + 1}.png`, base64Data, 'base64');
                console.log(`Wrote extracted_page_${index + 1}.png`);
            }
        });

        await browser.close();
        console.log('Done.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
