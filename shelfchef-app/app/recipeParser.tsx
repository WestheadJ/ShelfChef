// recipeParser.ts
export interface RecipeData {
    title: string | null;
    serves: number | null;
    times: { [key: string]: number };
    pages: number[];
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
}

/**
 * Normalize OCR text: fix common OCR errors and whitespace issues
 */
export function normalizeOCR(text: string): string {
    return text
        .replace(/\b1O\b/g, '10')
        .replace(/\b0O\b/g, '00')
        .replace(/\n+/g, '\n') // normalize newlines
        .replace(/[ \t]+/g, ' ') // normalize spaces
        .replace(/[^\x20-\x7E\n]/g, '') // remove non-printable chars
        .trim();
}

/**
 * Extract recipe information from OCR text
 */
export function parseRecipe(ocrText: string): RecipeData {
    const text = normalizeOCR(ocrText);

    // Title (assume first uppercase line)
    const titleMatch = text.match(/^[A-Z][A-Z\s]+/m);
    const title = titleMatch ? titleMatch[0].trim() : null;

    // Servings
    const servesMatch = text.match(/SERVES[:\s]*(\d+)/i);
    const serves = servesMatch ? parseInt(servesMatch[1], 10) : null;

    // Times: PREP, COOK, TOTAL
    const timeMatches = [...text.matchAll(/(PREP|COOK|TOTAL)[:\s]*([0-9]+)\s*mins?/gi)];
    const times: Record<string, number> = {};
    timeMatches.forEach(match => {
        times[match[1].toUpperCase()] = parseInt(match[2], 10);
    });

    // Ingredients: lines that look like "quantity + unit + ingredient"
    const ingredientMatches = text.match(
        /^\s*[\d/]+[\d\s\w.-]*(?:g|kg|ml|l|tsp|tbsp|cup|clove|slice)?[^\n]*/gm
    );
    const ingredients = ingredientMatches ? ingredientMatches.map(i => i.trim()) : [];

    // Page numbers
    const pageMatches = [...text.matchAll(/page\s*(\d+)/gi)].map(m => parseInt(m[1], 10));

    return { title, serves, times, pages: pageMatches };
}