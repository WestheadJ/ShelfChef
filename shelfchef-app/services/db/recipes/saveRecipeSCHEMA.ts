// 1. The Configuration Map - Adjusted for your schema column names
const dbQueries = {
    author: {
        insert: "INSERT OR IGNORE INTO authors (name) VALUES (?)",
        select: "SELECT id FROM authors WHERE name = ?"
    },
    book: {
        insert: "INSERT OR IGNORE INTO books (title, author_id) VALUES (?, ?)",
        select: "SELECT book_id AS id FROM books WHERE title = ? AND author_id = ?"
    },
    recipe: {
        insert: `INSERT OR IGNORE INTO recipes 
                 (name, page_number, book_id, prep_time, cook_time, total_time, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        select: "SELECT id FROM recipes WHERE name = ? AND book_id = ?"
    }
} as const;

type EntityType = keyof typeof dbQueries;

// 2. Optimized Database Utility
async function getOrCreate(db: any, entity: EntityType, insertParams: any[], selectParams: any[]) {
    const queries = dbQueries[entity];
    try {
        const result = await db.runAsync(queries.insert, insertParams);

        if (result.changes > 0) {
            return result.lastInsertRowId;
        }

        const existing = await db.getFirstAsync(queries.select, selectParams);
        return existing?.id ?? null;
    } catch (err) {
        console.error(`DATABASE ERROR [${entity}]:`, err);
        return null;
    }
}

async function insertIngredientsBatch(db: any, ingredients: any[], recipeId: number) {
    if (!ingredients || ingredients.length === 0) return;

    const placeholders = ingredients.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const query = `INSERT INTO ingredients (recipe_id, name, quantity, unit, extra_detail) VALUES ${placeholders}`;

    const variables = ingredients.flatMap(ing => {
        // Mapping incoming camelCase to your snake_case DB columns
        // Also using ?? null because SQLite prefers null over undefined
        return [
            recipeId,
            ing.name?.value ?? ing.name ?? 'Unknown',
            Number(ing.quantity?.value ?? ing.quantity) || 0,
            ing.unit?.value ?? ing.unit ?? null,
            // Changed from extra_detail to extraDetail to match your log
            ing.extraDetail?.value ?? ing.extraDetail ?? null
        ];
    });

    try {
        const result = await db.runAsync(query, variables);
        console.log(`Successfully inserted ${result.changes} ingredients.`);
    } catch (err) {
        console.error("BATCH INGREDIENT ERROR:", err);
        // Log variables to see exactly what bit of data caused the crash
        console.log("Variables sent to DB:", JSON.stringify(variables));
        throw err;
    }
}

// 4. Orchestrator
export async function saveRecipe(db: any, data: any) {
    try {
        // Step 1: Author
        const authorId = await getOrCreate(db, "author",
            [data.book.author],
            [data.book.author]
        );
        if (!authorId) throw new Error("Author resolution failed");

        // Step 2: Book
        const bookId = await getOrCreate(db, "book",
            [data.book.book_title, authorId],
            [data.book.book_title, authorId]
        );
        if (!bookId) throw new Error("Book resolution failed");

        // Step 3: Recipe
        const recipeId = await getOrCreate(db, "recipe", [
            data.name.value,
            data.book.pageNumber.value,
            bookId,
            data.prepTimeMinutes.value,
            data.cookTimeMinutes.value,
            data.totalCookTimeMinutes.value
        ], [
            data.name.value,
            bookId
        ]);
        if (!recipeId) throw new Error("Recipe resolution failed");

        // Step 4: Ingredients
        await insertIngredientsBatch(db, data.ingredients, recipeId);

        console.log("RECIPE SAVED SUCCESSFULLY");
    } catch (error) {
        console.error("SAVE ABORTED:", error);
    }
}