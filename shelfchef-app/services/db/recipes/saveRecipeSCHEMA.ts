export async function saveRecipe(db: any, data: any) {
    let authorId = null;
    try {
        // Use runAsync for INSERTs
        const result = await db.runAsync(
            "INSERT INTO authors (name) VALUES (?)",
            [data.book.author]
        );
        authorId = result.lastInsertRowId; // Grab the new ID
        console.log("SUCCESSFUL INSERT - AUTHOR ID:", authorId);
    }
    catch (err: any) {
        // You might want to check for a more specific constraint error here
        // but checking if it's an SQLite error works as a fallback
        if (err.code === "ERR_INTERNAL_SQLITE_ERROR" || err.message.includes('UNIQUE')) {
            const existingAuthor = await db.getFirstAsync(
                "SELECT id FROM authors WHERE name = ?",
                [data.book.author]
            );
            authorId = existingAuthor?.id;
            console.log("AUTHOR ALREADY EXISTS - FETCHED ID:", authorId);
        } else {
            console.error("UNEXPECTED ERROR:", err);
        }
    }
}