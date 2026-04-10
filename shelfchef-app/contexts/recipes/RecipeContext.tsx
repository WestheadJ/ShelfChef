import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { State, Action, RecipeAIResponse, IngredientField } from '@/types/recipe';

function reducer(state: State, action: Action): State {
    switch (action.type) {
        // ✅ Each set action now clears the others to prevent "empty" states
        case "SET_EDITING":
            return {
                ...state,
                editingIndex: action.index,
                editingTitle: false,
                editingBookField: null
            };
        case "SET_EDITING_TITLE":
            return {
                ...state,
                editingTitle: action.value,
                editingIndex: null,
                editingBookField: null
            };
        case "SET_EDITING_BOOK_FIELD":
            return {
                ...state,
                editingBookField: action.field,
                editingIndex: null,
                editingTitle: false
            };

        case "CLEANUP_EDITING":
            return {
                ...state,
                editingIndex: null,
                editingTitle: false,
                editingBookField: null
            };

        // ... (rest of your reducer cases remain the same)
        case "SET_SAVE": return { ...state, save: action.value };
        case "SET_RECIPE": return { ...state, recipeData: action.payload };
        case "UPDATE_RECIPE_NAME":
            if (!state.recipeData) return state;
            return {
                ...state,
                recipeData: { ...state.recipeData, name: { ...state.recipeData.name, value: action.value, confidence: 0 } },
                save: true
            };
        case "UPDATE_FIELD": {
            if (!state.recipeData) return state;
            const updatedIngredients = [...state.recipeData.ingredients];
            updatedIngredients[action.index] = {
                ...updatedIngredients[action.index],
                [action.field]: { ...updatedIngredients[action.index][action.field], value: action.value, confidence: 0 }
            };
            return { ...state, recipeData: { ...state.recipeData, ingredients: updatedIngredients }, save: true };
        }
        case "ADD_EXTRA_DETAIL": {
            if (!state.recipeData) return state;
            const updatedIngredients = [...state.recipeData.ingredients];
            updatedIngredients[action.index] = { ...updatedIngredients[action.index], extraDetail: { value: "detail", confidence: 0 } };
            return { ...state, recipeData: { ...state.recipeData, ingredients: updatedIngredients }, save: true };
        }
        case "RESET_ALL":
            return { recipeData: null, editingIndex: null, editingTitle: false, editingBookField: null, save: false };
        case "UPDATE_BOOK_FIELD":
            if (!state.recipeData) return state;
            return {
                ...state,
                recipeData: {
                    ...state.recipeData,
                    book: {
                        ...state.recipeData.book,
                        [action.field]: action.field === "pageNumber"
                            ? { ...state.recipeData.book.pageNumber, value: action.value, confidence: 0 }
                            : action.value
                    }
                },
                save: true
            };
        default: return state;
    }
}

type RecipeContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
    setInitialRecipe: (recipe: RecipeAIResponse) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        recipeData: null,
        editingIndex: null,
        editingTitle: false,
        editingBookField: null,
        save: false
    });

    const setInitialRecipe = (recipe: RecipeAIResponse) => {
        dispatch({ type: "SET_RECIPE", payload: recipe });
    };

    return (
        <RecipeContext.Provider value={{ state, dispatch, setInitialRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipeContext() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipeContext must be used within a RecipeProvider");
    }
    return context;
}