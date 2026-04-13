export async function saveRecipe(db: any, data: any) {
    const authorId = await insertAuthor(db, data.book.author);
    if (authorId) {
        const bookId = await insertBook(db, data.book.book_title, authorId);
        if (bookId) {
            // Now you have both authorId and bookId, you can proceed to insert the recipe
            // You would need to implement a similar function for inserting the recipe itself
            console.log("READY TO INSERT RECIPE WITH BOOK ID:", bookId);
        } else {
            console.log(bookId)
            console.log("FAILED TO GET BOOK ID");
        }
    }
    else { console.log("FAILED TO GET AUTHOR ID") }
}

async function insertAuthor(db: any, name: string) {

    let authorId = null;
    try {
        // Use runAsync for INSERTs
        const result = await db.runAsync(
            "INSERT INTO authors (name) VALUES (?)",
            [name]
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
                [name]
            );
            authorId = existingAuthor?.id;
            console.log("AUTHOR ALREADY EXISTS - FETCHED ID:", authorId);
        } else {
            console.error("UNEXPECTED ERROR:", err);
        }
    }
    return authorId;
}

async function insertBook(db: any, title: string, authorId: number) {
    let bookId = null;

    try {
        // Attempt to insert. If the unique combo exists, SQLite will silently ignore it.
        const result = await db.runAsync(
            "INSERT OR IGNORE INTO books (title, author_id) VALUES (?, ?)",
            [title, authorId]
        );

        // result.changes tells us how many rows were actually inserted
        if (result.changes > 0) {
            bookId = result.lastInsertRowId;
            console.log("SUCCESSFUL INSERT - BOOK ID:", bookId);
        } else {
            // changes === 0 means the book already existed. Let's fetch its ID.
            // (Make sure to select the actual primary key column name here, usually 'id')
            const existingBook = await db.getFirstAsync(
                "SELECT * FROM books WHERE title = ? AND author_id = ?",
                [title, authorId]
            );

            bookId = existingBook.book_id
            console.log("BOOK ALREADY EXISTS - FETCHED ID:", bookId);
        }
    }
    catch (err: any) {
        // Now, if we hit the catch block, it's a REAL unexpected error (like a missing table)
        console.error("UNEXPECTED SQLITE ERROR:", err);
    }

    return bookId;
}

async function insertRecipe(db: any, data: any) {
    let isRecipe = false;
    try {
        const result = await db.runAsync("INSERT INTO recipes (name, page_number, book_id, prep_time, cook_time, total_time) VALUES (?, ?, ?, ?, ?, ?)", [
            data.name.value,
            data.book.pageNumber.value,
            data.book.book_id,
            data.prepTimeMinutes.value,
            data.cookTimeMinutes.value,
            data.totalCookTimeMinutes.value
        ]);
        isRecipe = result.changes > 0;
        console.log("RECIPE INSERT RESULT:", result);

    }
    catch (err) {

    }
}

