import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipeContext } from "@/contexts/recipes/RecipeContext";
import { CardDetail } from "@/components/ui/EditIngredient/CardDetail";
import { Action, RecipeAIResponse } from "@/types/recipe";
import { reset } from "@/services/db/dbAPI";
import saveRecipe from "@/services/recipes/saveRecipe";
import { useEffect } from "react";

function normalizeRecipe(data: any): RecipeAIResponse {
    if (!data) return data;
    if (data.book) return data;
    const { pageNumber, ...rest } = data;
    return { ...rest, book: { book_title: "", author: "", pageNumber: pageNumber ?? { value: null, confidence: 0 } } };
}

export default function Preview() {
    const { data } = useLocalSearchParams();
    const { state, dispatch, setInitialRecipe } = useRecipeContext();

    useEffect(() => {
        if (data && !state.recipeData) {
            const parsed = normalizeRecipe(JSON.parse(data as string));
            setInitialRecipe(parsed);
        }
    }, [data]);

    if (!state.recipeData) return null;

    const openEditor = (action: Action) => {
        // ✅ NATIVE CRASH GUARD: Check if the modal is currently active or animating out
        const isModalActive =
            state.editingIndex !== null ||
            state.editingTitle !== false ||
            state.editingBookField !== null;

        if (isModalActive) {
            return; // Ignore the tap until the modal is 100% gone
        }

        dispatch(action);
        router.push("/edit-modal");
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ padding: 20, marginBottom: 80 }}>

                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Recipe Details:</Text>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}
                    onPress={() => openEditor({ type: "SET_EDITING_TITLE", value: true })}
                >
                    <Text style={{ fontSize: 20 }}>{state.recipeData.name?.value || "Untitled Recipe"}</Text>
                    <Ionicons name="pencil" size={16} color="gray" />
                </TouchableOpacity>

                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 30, marginBottom: 10 }}>Book Options:</Text>

                {["book_title", "author", "pageNumber"].map((field) => (
                    <TouchableOpacity
                        key={field}
                        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
                        onPress={() => openEditor({ type: "SET_EDITING_BOOK_FIELD", field: field as any })}
                    >
                        <Text style={{ flex: 1, fontSize: 16 }}>
                            {field === "book_title" ? "Book Title: " : field === "author" ? "Author: " : "Page Number: "}
                            {state.recipeData!.book[field]?.value ?? state.recipeData!.book[field] ?? "None"}
                        </Text>
                        <Ionicons name="pencil" size={14} color="gray" />
                    </TouchableOpacity>
                ))}

                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 30 }}>Ingredients:</Text>
                {state.recipeData.ingredients?.map((ing: any, i: number) => (
                    <TouchableOpacity
                        key={i}
                        style={{ marginTop: 12, borderWidth: 1, borderColor: "#eee", padding: 12, borderRadius: 8, flexDirection: "row", justifyContent: "space-between" }}
                        onPress={() => {
                            dispatch({ type: "SET_SAVE", value: false });
                            openEditor({ type: "SET_EDITING", index: i });
                        }}
                    >
                        <View>
                            {!!ing.quantity?.value && <CardDetail ingredient={ing} field="quantity" />}
                            {!!ing.unit?.value && <CardDetail ingredient={ing} field="unit" />}
                            {!!ing.name?.value && <CardDetail ingredient={ing} field="name" />}
                            {!!ing.extraDetail?.value && <CardDetail ingredient={ing} field="extraDetail" />}
                        </View>
                        <Ionicons name="pencil" size={18} color="gray" />
                    </TouchableOpacity>
                ))}

            </ScrollView>

            <View style={{ position: "absolute", bottom: 2, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 20, paddingBottom: 20 }}>
                <TouchableOpacity
                    style={{ backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                    onPress={() => {
                        dispatch({ type: "RESET_ALL" });
                        router.push("/capture");
                    }}
                >
                    <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                    onPress={async () => {
                        const saved = await saveRecipe(state.recipeData) || false;
                        if (saved[0] === false) {
                            let fields = saved[1].map((itm: any) => itm.label.replace("_", " ")).join(", ");
                            Alert.alert("Empty Fields", `These fields are empty: \n${fields}`, ["close"]);
                        }
                        else {
                            router.dismissAll();
                            router.replace("/");
                        }
                    }}

                >
                    <Text style={{ color: "white" }}>Save Recipe</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={{ position: "absolute", top: 0, right: 1, backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                onPress={async () => { await reset(); router.push("/capture") }}
            >
                <Text style={{ color: "white" }}>Reset DB</Text>
            </TouchableOpacity>
        </View >
    );
}