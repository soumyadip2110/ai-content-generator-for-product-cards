const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

export async function generateProductDetails(productName, category, signal) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing. Check your .env file and restart the dev server.");
    }

    const prompt = buildPrompt(productName, category);
    const rawResponse = await postToGemini(apiKey, prompt, signal);
    return parseAndValidateResponse(rawResponse);
}

function buildPrompt(productName, category) {
    if (typeof productName !== "string" || typeof category !== "string") {
        throw new Error("Invalid input format.");
    }

    const cleanName = productName.trim().slice(0, 100);
    const cleanCategory = category.trim().slice(0, 50);

    if (!cleanName || !cleanCategory) {
        throw new Error("Product name and category are required.");
    }

    return `Generate product card details for a product named "${cleanName}" in the "${cleanCategory}" category. Return ONLY a valid JSON object with these exact keys: "title" (string, catchy marketing title), "description" (string, 2 concise sentences), and "keywords" (array of 4 to 5 short lowercase tag strings).`;
}

async function postToGemini(apiKey, prompt, signal) {
    try {
        const response = await fetch(`${API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    thinkingConfig: { thinkingLevel: "low" },
                },
            }),
        });

        if (!response.ok) {
            await throwMappedHttpError(response);
        }

        return await response.json();
    } catch (err) {
        if (err.name === "AbortError" || signal?.aborted) {
            throw new Error("REQUEST_CANCELED");
        }
        if (
            err.message.startsWith("API Error") ||
            err.message.includes("API key") ||
            err.message.includes("Rate limit") ||
            err.message.includes("Gemini service") ||
            err.message.includes("endpoint")
        ) {
            throw err;
        }
        throw new Error("Network error. Check your internet connection and try again.");
    }
}

async function throwMappedHttpError(response) {
    let apiMessage = "";
    try {
        const errData = await response.json();
        apiMessage = errData?.error?.message || "";
    } catch {
        // Ignore non-JSON error bodies
    }

    switch (response.status) {
        case 400:
            throw new Error(apiMessage || "Invalid request or malformed API key.");
        case 401:
        case 403:
            throw new Error("API key unauthorized or restricted. Check your Gemini API key settings.");
        case 404:
            throw new Error("AI model endpoint not found. Verify the model name in aiService.js.");
        case 429:
            throw new Error("Rate limit exceeded. Please wait a few seconds and try again.");
        case 500:
        case 503:
            throw new Error("Gemini service is temporarily unavailable. Please try again shortly.");
        case 504:
            throw new Error("The AI server timed out before finishing. Please try again.");
        default:
            throw new Error(`API Error (${response.status}): ${apiMessage || "Failed to generate details."}`);
    }
}

function parseAndValidateResponse(data) {
    const candidate = data?.candidates?.[0];

    if (candidate?.finishReason === "SAFETY") {
        throw new Error("Content was blocked by AI safety filters. Try different product wording.");
    }
    if (candidate?.finishReason === "MAX_TOKENS") {
        throw new Error("Response was cut off due to length limits. Please try again.");
    }

    const rawText = candidate?.content?.parts?.[0]?.text;
    if (!rawText) {
        throw new Error("AI returned an empty response. Please try again.");
    }

    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch {
        throw new Error("AI returned malformed JSON. Please click Generate Details again.");
    }

    if (
        typeof parsed.title !== "string" ||
        !parsed.title.trim() ||
        typeof parsed.description !== "string" ||
        !parsed.description.trim() ||
        !Array.isArray(parsed.keywords) ||
        parsed.keywords.length === 0
    ) {
        throw new Error("Incomplete product data generated. Please try again.");
    }

    return {
        title: parsed.title.trim(),
        description: parsed.description.trim(),
        keywords: parsed.keywords
            .filter((kw) => typeof kw === "string" && kw.trim())
            .map((kw) => kw.trim().toLowerCase()),
    };
}