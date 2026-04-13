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
    PRAGMA foreign_keys = OFF;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS units;
        DROP TABLE IF EXISTS recipes;
        DROP TABLE IF EXISTS books;
        DROP TABLE IF EXISTS authors;
        PRAGMA foreign_keys = ON;
  `);
    await initDatabase();
}

export async function insertRecipe(data: any) {
    let res = await saveRecipe(db, data);
}