export default async function getIngredientsSCHEMA(db: any) {
    const result = await db.getAllAsync<any>(
        `SELECT * FROM ingredients`
    );

    console.log("INGREDIENTS DB RESULT", result);
    return result;
}
