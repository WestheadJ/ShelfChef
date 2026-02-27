export interface ConfidenceField<T> {
    value: T | null;
    confidence: number;
}

export interface Book {
    book_title: string;
    author: string;
    pageNumber: ConfidenceField<number>;
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
    book: Book;
    totalCookTimeMinutes: ConfidenceField<number>;
    cookTimeMinutes: ConfidenceField<number>;
    prepTimeMinutes: ConfidenceField<number>;
    servings: ConfidenceField<number>;
    ingredients: Ingredient[];
}

export type State = {
    recipeData: RecipeAIResponse | null;
    editingIndex: number | null;
    editingTitle: boolean;
    editingBookField: "book_title" | "author" | "pageNumber" | null;
    save: boolean;
};

export type Action =
    | { type: "SET_EDITING"; index: number | null }
    | { type: "SET_EDITING_TITLE"; value: boolean }
    | { type: "SET_RECIPE"; payload: any }
    | { type: "UPDATE_FIELD"; index: number; field: IngredientField; value: any }
    | { type: "UPDATE_RECIPE_NAME"; value: string }
    | { type: "ADD_EXTRA_DETAIL"; index: number }
    | { type: "SET_SAVE"; value: boolean }
    | { type: "RESET_ALL" }
    | { type: "SET_EDITING_BOOK"; value: boolean }
    | { type: "UPDATE_BOOK_FIELD"; field: "book_title" | "author" | "pageNumber"; value: string | number }
    | { type: "SET_EDITING_BOOK_FIELD"; field: "book_title" | "author" | "pageNumber" | null };