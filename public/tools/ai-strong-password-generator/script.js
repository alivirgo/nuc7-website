(() => {
	"use strict";

	// Character pools are intentionally small and explicit so the UI and generator agree.
	const POOLS = {
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		numbers: "0123456789",
		symbols: "!@#$%",
	};

	// A compact local word list for memorable passphrases. No network request is needed.
	const WORDS = [
		"anchor",
		"artist",
		"atlas",
		"bamboo",
		"beacon",
		"breeze",
		"canvas",
		"canyon",
		"cedar",
		"cinder",
		"cloud",
		"comet",
		"copper",
		"crystal",
		"dawn",
		"delta",
		"drift",
		"eagle",
		"ember",
		"falcon",
		"forest",
		"garden",
		"glacier",
		"harbor",
		"hazel",
		"honest",
		"indigo",
		"island",
		"jungle",
		"kitten",
		"lantern",
		"meadow",
		"meteor",
		"midnight",
		"nectar",
		"oasis",
		"orbit",
		"pebble",
		"pepper",
		"pilot",
		"planet",
		"quartz",
		"rabbit",
		"river",
		"rocket",
		"saffron",
		"shadow",
		"silver",
		"summit",
		"temple",
		"thunder",
		"tiger",
		"velvet",
		"violet",
		"voyage",
		"walnut",
		"window",
		"winter",
		"yellow",
		"zephyr",
	];

	// Conservative attacker-friendly model requested for the UI copy.
	const BCRYPT_10_GUESSES_PER_SECOND = 12_000_000;
	const SECONDS_IN_YEAR = 31_557_600;

	const elements = {
		password: document.getElementById("password-output"),
		emoji: document.getElementById("emoji-meter"),
		fill: document.getElementById("feedback-fill"),
		crackTime: document.getElementById("crack-time"),
		details: document.getElementById("strength-details"),
		strengthLabel: document.getElementById("strength-label"),
		lengthSlider: document.getElementById("length-slider"),
		lengthValue: document.getElementById("length-value"),
		generateButton: document.getElementById("generate-button"),
		copyButton: document.getElementById("copy-button"),
		status: document.getElementById("status-message"),
		uppercase: document.getElementById("include-uppercase"),
		lowercase: document.getElementById("include-lowercase"),
		numbers: document.getElementById("include-numbers"),
		symbols: document.getElementById("include-symbols"),
	};

	/**
	 * Reads the active checkbox state once, keeping generation and strength code simple.
	 */
	function getOptions() {
		return {
			uppercase: elements.uppercase.checked,
			lowercase: elements.lowercase.checked,
			numbers: elements.numbers.checked,
			symbols: elements.symbols.checked,
		};
	}

	/**
	 * Browser crypto gives unbiased integer bytes. Rejection sampling avoids modulo bias.
	 */
	function secureIndex(maxExclusive) {
		if (maxExclusive <= 0) return 0;

		const random = new Uint32Array(1);
		const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;

		do {
			window.crypto.getRandomValues(random);
		} while (random[0] >= limit);

		return random[0] % maxExclusive;
	}

	function pick(source) {
		return source[secureIndex(source.length)];
	}

	/**
	 * Fisher-Yates shuffle using secure randomness, so required characters are not predictable.
	 */
	function shuffleSecure(items) {
		const copy = [...items];
		for (let index = copy.length - 1; index > 0; index -= 1) {
			const swapIndex = secureIndex(index + 1);
			[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
		}
		return copy;
	}

	function selectedPools(options) {
		return Object.entries(options)
			.filter(([, enabled]) => enabled)
			.map(([key]) => POOLS[key]);
	}

	/**
	 * Random mode guarantees at least one character from every selected pool.
	 */
	function generateRandomPassword(length, options) {
		let pools = selectedPools(options);

		if (!pools.length) {
			elements.lowercase.checked = true;
			pools = [POOLS.lowercase];
			setStatus("Lowercase was re-enabled so a password can be generated.");
		}

		const requiredCharacters = pools.map((pool) => pick(pool));
		const allCharacters = pools.join("");
		const remainingLength = Math.max(0, length - requiredCharacters.length);
		const remainingCharacters = Array.from({ length: remainingLength }, () => pick(allCharacters));

		return shuffleSecure([...requiredCharacters, ...remainingCharacters]).join("").slice(0, length);
	}

	function titleCase(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	/**
	 * Memorable mode uses 3-4 words locally. The length slider controls compactness.
	 */
	function generateMemorablePassword(length, options) {
		const wordCount = length >= 11 ? 4 : 3;
		const words = Array.from({ length: wordCount }, () => pick(WORDS));
		const casedWords = options.uppercase ? words.map(titleCase) : words;
		const suffix = [];

		if (options.numbers) {
			suffix.push(String(secureIndex(90) + 10));
		}

		if (options.symbols) {
			suffix.push(pick(POOLS.symbols));
		}

		return `${casedWords.join("-")}${suffix.join("")}`;
	}

	function getGenerationType() {
		const selected = document.querySelector('input[name="generation-type"]:checked');
		return selected ? selected.value : "random";
	}

	function generatePassword() {
		const length = Number(elements.lengthSlider.value);
		const options = getOptions();
		const type = getGenerationType();
		const password =
			type === "memorable"
				? generateMemorablePassword(length, options)
				: generateRandomPassword(length, options);

		elements.password.value = password;
		setStatus(type === "memorable" ? "Memorable passphrase generated locally." : "Random password generated locally.");
		updateStrength(password);
	}

	function detectCharsetSize(password) {
		let size = 0;
		const parts = [];

		if (/[a-z]/.test(password)) {
			size += 26;
			parts.push("lowercase");
		}
		if (/[A-Z]/.test(password)) {
			size += 26;
			parts.push("uppercase");
		}
		if (/[0-9]/.test(password)) {
			size += 10;
			parts.push("numbers");
		}
		if (/[^A-Za-z0-9]/.test(password)) {
			size += 33;
			parts.push("symbols");
		}

		return {
			size: Math.max(size, 1),
			label: parts.length ? parts.join(", ") : "none",
		};
	}

	/**
	 * Repetition and obvious sequences reduce the practical search space.
	 */
	function patternPenalty(password) {
		let penalty = 1;
		const lower = password.toLowerCase();
		const uniqueRatio = new Set(lower).size / Math.max(lower.length, 1);

		if (uniqueRatio < 0.45) penalty *= 0.58;
		if (/(.)\1{2,}/.test(lower)) penalty *= 0.62;
		if (/0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv/.test(lower)) penalty *= 0.5;
		if (/password|admin|welcome|letmein|qwerty|nuc7|studios/.test(lower)) penalty *= 0.36;

		return penalty;
	}

	function estimateCrackSeconds(password) {
		if (!password) {
			return {
				seconds: 0,
				entropyBits: 0,
				charsetSize: 0,
				complexityLabel: "none",
			};
		}

		const charset = detectCharsetSize(password);
		const rawEntropyBits = password.length * Math.log2(charset.size);
		const adjustedEntropyBits = Math.max(1, rawEntropyBits * patternPenalty(password));
		const averageGuesses = 2 ** Math.max(0, adjustedEntropyBits - 1);
		const seconds = averageGuesses / BCRYPT_10_GUESSES_PER_SECOND;

		return {
			seconds,
			entropyBits: adjustedEntropyBits,
			charsetSize: charset.size,
			complexityLabel: charset.label,
		};
	}

	function formatDuration(seconds) {
		if (seconds <= 1) return "instantly";
		if (seconds < 60) return `${Math.round(seconds)} seconds`;
		if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
		if (seconds < 86_400) return `${Math.round(seconds / 3600)} hours`;
		if (seconds < 2_592_000) return `${Math.round(seconds / 86_400)} days`;
		if (seconds < SECONDS_IN_YEAR) return `${Math.round(seconds / 2_592_000)} months`;
		if (seconds < 100 * SECONDS_IN_YEAR) return `${Math.round(seconds / SECONDS_IN_YEAR)} years`;
		if (seconds < 1000 * SECONDS_IN_YEAR) return `${Math.round(seconds / (100 * SECONDS_IN_YEAR))} centuries`;
		if (seconds < 1_000_000 * SECONDS_IN_YEAR) return `${Math.round(seconds / (1000 * SECONDS_IN_YEAR))} millennia`;
		return "millions of years";
	}

	function strengthFromSeconds(seconds) {
		if (seconds < 86_400) {
			return {
				label: "Weak",
				emoji: "😠",
				width: 24,
			};
		}

		if (seconds < 100 * SECONDS_IN_YEAR) {
			return {
				label: "Medium",
				emoji: "😐",
				width: 58,
			};
		}

		return {
			label: "Strong",
			emoji: "🤩",
			width: 96,
		};
	}

	function updateStrength(password) {
		const estimate = estimateCrackSeconds(password);

		if (!password) {
			elements.emoji.textContent = "😐";
			elements.strengthLabel.textContent = "Ready";
			elements.fill.style.width = "0%";
			elements.crackTime.textContent = "Time to crack: waiting for a password.";
			elements.details.textContent = "Estimate assumes 12x RTX 5090 GPUs attacking bcrypt-10 hashes.";
			return;
		}

		const strength = strengthFromSeconds(estimate.seconds);

		elements.emoji.textContent = strength.emoji;
		elements.strengthLabel.textContent = strength.label;
		elements.fill.style.width = `${strength.width}%`;
		elements.crackTime.textContent = `Time to crack: ${formatDuration(estimate.seconds)}.`;
		elements.details.textContent = `Length ${password.length}, ${estimate.complexityLabel}; estimated ${Math.round(
			estimate.entropyBits,
		)} bits under the local matrix.`;
	}

	function setStatus(message) {
		elements.status.textContent = message;
	}

	async function copyPassword() {
		const password = elements.password.value;

		if (!password) {
			setStatus("Generate or type a password before copying.");
			return;
		}

		try {
			await navigator.clipboard.writeText(password);
		} catch {
			elements.password.select();
			document.execCommand("copy");
			elements.password.setSelectionRange(password.length, password.length);
		}

		elements.copyButton.classList.add("copied");
		elements.copyButton.textContent = "Copied";
		setStatus("Copied to clipboard.");

		window.setTimeout(() => {
			elements.copyButton.classList.remove("copied");
			elements.copyButton.textContent = "Copy to Clipboard";
		}, 1400);
	}

	function updateLengthLabel() {
		elements.lengthValue.value = elements.lengthSlider.value;
		elements.lengthValue.textContent = elements.lengthSlider.value;
	}

	function bindEvents() {
		elements.lengthSlider.addEventListener("input", updateLengthLabel);
		elements.generateButton.addEventListener("click", generatePassword);
		elements.copyButton.addEventListener("click", copyPassword);
		elements.password.addEventListener("input", () => {
			setStatus("Testing typed password locally.");
			updateStrength(elements.password.value);
		});

		document.querySelectorAll('input[name="generation-type"], .option-panel input').forEach((input) => {
			input.addEventListener("change", () => updateStrength(elements.password.value));
		});
	}

	function init() {
		updateLengthLabel();
		bindEvents();
		generatePassword();
	}

	init();
})();
