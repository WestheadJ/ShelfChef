import * as SQLite from "expo-sqlite";
import { initDatabase } from "./bootstrap";
import { saveRecipe } from "./recipes/saveRecipeSCHEMA";

const db = SQLite.openDatabaseSync("shelfchef.db");



export async function getRecipeCount() {
    const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM recipes`
    );
    return result
}

export async function reset() {
    console.log("RESETTING")
    await db.execAsync(`
    DROP TABLE IF EXISTS authors;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS units;
    DROP TABLE IF EXISTS ingredients;
    DROP TABLE IF EXISTS recipes;
  `);
    await initDatabase();
}

export async function insertRecipe(data: any) {
    let res = await saveRecipe(db, data);
}