import { createContext, useContext, useState } from "react";

const RecipeContext = createContext<any>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
    const [recipes, setRecipes] = useState<any[]>([]);

    async function loadRecipes() {
        // Replace with AsyncStorage / API later
        const stored = [];
        setRecipes(stored);
        return stored;
    }

    return (
        <RecipeContext.Provider value={{ recipes, setRecipes, loadRecipes }}>
            {children}
        </RecipeContext.Provider>
    );
}

/**
 * This is the important part you were asking about.
 * Custom hook to access context safely.
 */
export function useRecipeContext() {
    const context = useContext(RecipeContext);

    if (!context) {
        throw new Error("useRecipeContext must be used inside RecipeProvider");
    }

    return context;
}