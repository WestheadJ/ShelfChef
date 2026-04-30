type RecentRecipeRow = {
    recipeID: number;
    recipeName: string;
    cook_time: string | null;
    prep_time: string | null;
    total_time: string | null;
    page_number: number | null;
    bookTitle: string | null;
    authorName: string | null;
    ingredients: string | null;
};

export default async function getRecentRecipesSCHEMA(db: any) {
    const result = await db.getAllAsync<RecentRecipeRow>(
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
        `,
    );

    const formatted = result.map((row) => ({
        ...row,
        ingredients: row.ingredients ? row.ingredients.split(",") : []
    }));

    console.log("DB RESULT", formatted);
    return formatted;
}
