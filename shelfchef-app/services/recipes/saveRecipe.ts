import { insertRecipe } from "../db/dbAPI";

export default function saveRecipe(data: any) {
    const field = checkFields(data);
    console.log("DATA CHECK", data)
    if (field[0] === false) {
        return field
    }
    else {
        insertRecipe(data);
    }
}

function checkFields(data: any) {
    const fields = [
        { label: "author", value: data.book.author },
        { label: "book_title", value: data.book.book_title },
        { label: "pageNumber", value: data.book.pageNumber.value },
        { label: "cookTimeMinutes", value: data.cookTimeMinutes.value },
        { label: "name", value: data.name.value },
        { label: "servings", value: data.servings.value },
        { label: "prepTimeMinutes", value: data.prepTimeMinutes.value },
        { label: "totalCookTimeMinutes", value: data.totalCookTimeMinutes.value },
        { label: "ingredients", value: data.ingredients.length > 0 ? data.ingredients : null },
    ];

    const firstEmpty = fields.find(f => f.value === "" || f.value === null);
    const emptyFields = fields.filter((f) => f.value === "" || f.value === null)

    if (firstEmpty) {
        return [false, emptyFields];
    }


    return [true];
}