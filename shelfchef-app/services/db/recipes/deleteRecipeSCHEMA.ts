const dbQueries = {
    ingredients: 'DELETE FROM ingredients WHERE recipe_id = ?',
    recipe: 'DELETE FROM recipes WHERE id = ?'
}

export default async function deleteRecipe(db: any, recipeID: number) {
    try {
        console.log(`Attempting to delete recipe with ID ${recipeID} and its ingredients...`);
        await db.runAsync(dbQueries.ingredients, [recipeID]);
        await db.runAsync(dbQueries.recipe, [recipeID]);
        console.log(`Successfully deleted recipe with ID ${recipeID} and its ingredients.`);
        return true
    } catch (err) {
        console.error(`DELETE RECIPE ERROR:`, err);
        return false
    }
}