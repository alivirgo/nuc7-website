const crackTimeMatrix = {
    4: ["Instantly", "Instantly", "Instantly", "Instantly", "Instantly"],
    5: ["Instantly", "Instantly", "57 minutes", "2 hours", "4 hours"],
    6: ["Instantly", "46 minutes", "2 days", "6 days", "2 weeks"],
    7: ["Instantly", "20 hours", "4 months", "1 year", "2 years"],
    8: ["Instantly", "3 weeks", "15 years", "62 years", "164 years"],
    9: ["2 hours", "2 years", "791 years", "3k years", "11k years"],
    10: ["1 day", "40 years", "41k years", "238k years", "803k years"],
    11: ["1 week", "1k years", "2m years", "14m years", "56m years"],
    12: ["3 months", "27k years", "111m years", "917m years", "3bn years"],
    13: ["3 years", "705k years", "5bn years", "56bn years", "275bn years"],
    14: ["28 years", "18m years", "300bn years", "3tn years", "19tn years"],
    15: ["284 years", "477m years", "15tn years", "218tn years", "1qd years"],
    16: ["2k years", "12bn years", "812tn years", "13qd years", "94qd years"],
    17: ["28k years", "322bn years", "42qd years", "840qd years", "6qn years"],
    18: ["284k years", "8tn years", "2qn years", "52qn years", "463qn years"]
};

// Wordlist for memorable passwords
const wordlist = ["apple", "river", "cloud", "stone", "light", "shadow", "ocean", "mountain", "forest", "desert", "eagle", "tiger", "wolf", "dragon", "phoenix", "star", "moon", "sun", "galaxy", "comet", "spark", "flame", "ember", "ash", "smoke", "wind", "storm", "thunder", "lightning", "rain", "snow", "ice", "frost", "crystal", "gem", "gold", "silver", "iron", "steel", "copper", "brass", "wood", "leaf", "branch", "root", "seed", "flower", "petal", "thorn", "vine", "bird", "fish", "snake", "bear", "lion", "panther", "hawk", "owl", "raven", "crow", "sword", "shield", "bow", "arrow", "spear", "axe", "hammer", "dagger", "knife", "blade", "knight", "king", "queen", "prince", "princess", "castle", "tower", "wall", "gate", "bridge", "road", "path", "trail", "journey", "quest", "adventure", "story", "tale", "myth", "legend", "hero", "villain", "friend", "enemy", "ally", "rival", "secret", "truth", "lie", "mystery", "enigma"];

// Character Sets
const CHARS_NUMBERS = "0123456789";
const CHARS_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const CHARS_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CHARS_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

// Elements
const lengthSlider = document.getElementById("pg-length");
const lengthVal = document.getElementById("pg-length-val");
const chkNumbers = document.getElementById("pg-numbers");
const chkLowercase = document.getElementById("pg-lowercase");
const chkUppercase = document.getElementById("pg-uppercase");
const chkSymbols = document.getElementById("pg-symbols");
const typeRandom = document.getElementById("pg-type-random");
const typeMemorable = document.getElementById("pg-type-memorable");
const resultInput = document.getElementById("pg-result");
const timeFeedback = document.getElementById("pg-time");
const emojiFace = document.getElementById("pg-emoji");
const btnGenerate = document.getElementById("pg-generate");
const btnCopy = document.getElementById("pg-copy");

function getCharsetIndex(hasNumbers, hasLower, hasUpper, hasSymbols) {
    if (hasSymbols) return 4; // Numbers, Upper and Lowercase Letters, Symbols
    if (hasNumbers && hasLower && hasUpper) return 3; // Numbers, Upper and Lowercase Letters
    if (hasLower && hasUpper) return 2; // Upper and Lowercase Letters
    if (hasLower && !hasUpper && !hasSymbols && !hasNumbers) return 1; // Lowercase Letters
    if (hasNumbers && !hasLower && !hasUpper && !hasSymbols) return 0; // Numbers Only
    
    // Fallbacks if combinations don't match matrix perfectly
    if (hasUpper && !hasLower) return 1; // Treat uppercase only like lowercase only
    if (hasNumbers && (hasLower || hasUpper)) return 2; // Treat numbers + single case like mixed case
    
    return 4; // Default to highest if unknown
}

function calculateCrackTime(password) {
    let hasNumbers = /[0-9]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasUpper = /[A-Z]/.test(password);
    let hasSymbols = /[^a-zA-Z0-9]/.test(password);
    
    let len = password.length;
    if (len < 4) return "Instantly";
    if (len > 18) len = 18; // Cap at 18 for lookup
    
    let colIndex = getCharsetIndex(hasNumbers, hasLower, hasUpper, hasSymbols);
    return crackTimeMatrix[len][colIndex];
}

function updateEmojiAndFeedback(password) {
    let time = calculateCrackTime(password);
    timeFeedback.textContent = time;
    
    let timeString = time.toLowerCase();
    
    // Evaluate strength based on time
    if (timeString.includes("instantly") || timeString.includes("minute") || timeString.includes("hour") || password.length < 8) {
        emojiFace.textContent = "😠"; // Weak
        emojiFace.className = "weak";
    } else if (timeString.includes("day") || timeString.includes("week") || timeString.includes("month") || timeString.includes("year") && !timeString.includes("k") && !timeString.includes("m") && !timeString.includes("bn") && !timeString.includes("tn") && !timeString.includes("qd") && !timeString.includes("qn")) {
        let yearsNum = parseInt(timeString);
        if (!isNaN(yearsNum) && timeString.includes("year") && yearsNum > 100) {
            emojiFace.textContent = "🤩"; // Strong
            emojiFace.className = "strong";
        } else {
            emojiFace.textContent = "😐"; // Medium
            emojiFace.className = "medium";
        }
    } else {
        emojiFace.textContent = "🤩"; // Strong
        emojiFace.className = "strong";
    }
    
    if(password.length === 0) {
        emojiFace.textContent = "😐";
        timeFeedback.textContent = "Instantly";
    }
}

function generateRandomPassword(length, hasNumbers, hasLower, hasUpper, hasSymbols) {
    let charset = "";
    if (hasNumbers) charset += CHARS_NUMBERS;
    if (hasLower) charset += CHARS_LOWERCASE;
    if (hasUpper) charset += CHARS_UPPERCASE;
    if (hasSymbols) charset += CHARS_SYMBOLS;
    
    if (charset === "") {
        charset = CHARS_LOWERCASE; // Fallback
        chkLowercase.checked = true;
    }
    
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Ensure at least one character from each selected set is present if possible
    let finalPassword = password.split('');
    let idx = 0;
    if(hasNumbers && length > idx) { finalPassword[idx++] = CHARS_NUMBERS[Math.floor(Math.random() * CHARS_NUMBERS.length)]; }
    if(hasLower && length > idx) { finalPassword[idx++] = CHARS_LOWERCASE[Math.floor(Math.random() * CHARS_LOWERCASE.length)]; }
    if(hasUpper && length > idx) { finalPassword[idx++] = CHARS_UPPERCASE[Math.floor(Math.random() * CHARS_UPPERCASE.length)]; }
    if(hasSymbols && length > idx) { finalPassword[idx++] = CHARS_SYMBOLS[Math.floor(Math.random() * CHARS_SYMBOLS.length)]; }
    
    // Shuffle
    for (let i = finalPassword.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalPassword[i], finalPassword[j]] = [finalPassword[j], finalPassword[i]];
    }
    
    return finalPassword.join('');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateMemorablePassword(hasNumbers, hasUpper, hasSymbols) {
    let wordsCount = 3;
    let pwd = "";
    for(let i=0; i<wordsCount; i++) {
        let w = wordlist[Math.floor(Math.random() * wordlist.length)];
        if(hasUpper && i === 0) w = capitalize(w); // Capitalize first word
        pwd += w;
        if(i < wordsCount - 1) {
            if(hasSymbols) {
                pwd += "-";
            }
        }
    }
    if(hasNumbers) {
        pwd += Math.floor(Math.random() * 90 + 10); // add 2 digits
    }
    if(hasSymbols && !pwd.includes("-")) {
        pwd += "!";
    } else if (hasSymbols && pwd.includes("-")) {
        pwd += "!";
    }
    return pwd;
}

function generatePassword() {
    let length = parseInt(lengthSlider.value);
    let hasNumbers = chkNumbers.checked;
    let hasLower = chkLowercase.checked;
    let hasUpper = chkUppercase.checked;
    let hasSymbols = chkSymbols.checked;
    let isMemorable = typeMemorable.checked;
    
    let pwd = "";
    if (isMemorable) {
        pwd = generateMemorablePassword(hasNumbers, hasUpper, hasSymbols);
        // Memorable ignores strict length to make sense, but we can substring or regenerate
        if(pwd.length > 18) {
            pwd = pwd.substring(0, 18);
        }
        // update slider to match if possible
        if(pwd.length <= 18 && pwd.length >= 4) {
            lengthSlider.value = pwd.length;
            lengthVal.textContent = pwd.length;
        }
    } else {
        pwd = generateRandomPassword(length, hasNumbers, hasLower, hasUpper, hasSymbols);
    }
    
    resultInput.value = pwd;
    updateEmojiAndFeedback(pwd);
}

// Event Listeners
lengthSlider.addEventListener("input", (e) => {
    lengthVal.textContent = e.target.value;
    generatePassword();
});

[chkNumbers, chkLowercase, chkUppercase, chkSymbols, typeRandom, typeMemorable].forEach(el => {
    el.addEventListener("change", generatePassword);
});

btnGenerate.addEventListener("click", generatePassword);

btnCopy.addEventListener("click", () => {
    if(resultInput.value) {
        navigator.clipboard.writeText(resultInput.value).then(() => {
            let origText = btnCopy.textContent;
            btnCopy.textContent = "Copied!";
            setTimeout(() => { btnCopy.textContent = origText; }, 2000);
        });
    }
});

resultInput.addEventListener("input", (e) => {
    updateEmojiAndFeedback(e.target.value);
});

// Initial generation
generatePassword();
