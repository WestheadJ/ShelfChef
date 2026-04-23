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

export async function getRecentRecipes(limit: number = 10) {
    const result = await db.getAllAsync<any>(
        `SELECT
  r.id as recipeID,
  r.name as recipeName,
  r.cook_time,
  r.prep_time,
  r.total_time,
  r.page_number,
  b.title as bookTitle,
  a.name as authorName,
  GROUP_CONCAT(i.name) as ingredients
FROM recipes r
LEFT JOIN books b ON r.book_id = b.book_id
LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN ingredients i ON r.id = i.recipe_id
GROUP BY r.id
ORDER BY r.created_at DESC
LIMIT ?`,
        [limit]
    );

    const formatted = result.map(row => ({
        ...row,
        ingredients: row.ingredients ? row.ingredients.split(',') : []
    }));
    console.log("DB RESULT", formatted)
    return formatted;
}

export async function getIngredients() {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM ingredients`
    );
    console.log("INGREDIENTS DB RESULT", result)
    return result;
}