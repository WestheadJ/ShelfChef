export interface ConfidenceField<T> {
    value: T | null;
    confidence: number;
}

export interface Ingredient {
    name: ConfidenceField<string>;
    quantity: ConfidenceField<number>;
    unit: ConfidenceField<string>;
    extraDetail: ConfidenceField<string>;
}

export interface RecipeAIResponse {
    name: ConfidenceField<string>;
    pageNumber: ConfidenceField<number>;
    totalCookTimeMinutes: ConfidenceField<number>;
    cookTimeMinutes: ConfidenceField<number>;
    prepTimeMinutes: ConfidenceField<number>;
    servings: ConfidenceField<number>;
    ingredients: Ingredient[];
}

export interface RecipeDraft {
    bookTitle?: string;
    author?: string;
    recipeName?: string;
    data?: RecipeAIResponse;
    photoUri?: string;
}