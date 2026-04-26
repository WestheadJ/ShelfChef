import * as SQLite from "expo-sqlite";
import { saveRecipe } from "./recipes/saveRecipeSCHEMA";
import deleteRecipeSCHEMA from "./recipes/deleteRecipeSCHEMA";
import getRecipeCountSCHEMA from "./queries/getRecipeCountSCHEMA";
import getRecentRecipesSCHEMA from "./queries/getRecentRecipesSCHEMA";
import getIngredientsSCHEMA from "./queries/getIngredientsSCHEMA";
import resetDatabaseSCHEMA from "./queries/resetDatabaseSCHEMA";

const db = SQLite.openDatabaseSync("shelfchef.db");

export async function getRecipeCount() {
    return getRecipeCountSCHEMA(db);
}

export async function reset() {
    return resetDatabaseSCHEMA(db);
}

export async function insertRecipe(data: any) {
    return saveRecipe(db, data);
}

export async function getRecentRecipes(limit: number = 10) {
    return getRecentRecipesSCHEMA(db, limit);
}

export async function getIngredients() {
    return getIngredientsSCHEMA(db);
}

export async function deleteRecipe(recipeID: number) {
    return deleteRecipeSCHEMA(db, recipeID);
}
