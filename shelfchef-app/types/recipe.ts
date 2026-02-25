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

export type IngredientField = "name" | "quantity" | "unit" | "extraDetail";


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

export type State = {
    recipeData: any;
    editingIndex: number | null;
    save: boolean;
};

export type Action =
    | { type: "SET_EDITING"; index: number | null }
    | { type: "SET_RECIPE"; payload: any }
    | { type: "UPDATE_FIELD"; index: number; field: IngredientField; value: any }
    | { type: "ADD_EXTRA_DETAIL"; index: number }
    | { type: "SET_SAVE"; value: boolean }
    | { type: "RESET_ALL" };