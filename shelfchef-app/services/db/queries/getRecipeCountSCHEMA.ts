export default async function getRecipeCountSCHEMA(db: any) {
    return db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM recipes`
    );
}
