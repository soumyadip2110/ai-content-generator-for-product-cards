const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

export async function generateProductDetails(productName, category) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing. Check your .env file and restart the dev server.");
    }

    // Sanitize and enforce length limits before sending
    const cleanName = productName.trim().slice(0, 100);
    const cleanCategory = category.trim().slice(0, 50);

    if (!cleanName || !cleanCategory) {
        throw new Error("Product name and category are required.");
    }

    const prompt = `Generate product card details for a product named "${cleanName}" in the "${cleanCategory}" category. Return ONLY a valid JSON object with these exact keys: "title" (string, catchy marketing title), "description" (string, 2 concise sentences), and "keywords" (array of 4 to 5 short lowercase tag strings).`;

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`API Error (${response.status}): Failed to generate details.`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        throw new Error("Invalid response format received from AI.");
    }

    const parsed = JSON.parse(rawText);

    // Validate expected response structure before returning to UI
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.keywords)) {
        throw new Error("Incomplete product data generated.");
    }

    return parsed;
}