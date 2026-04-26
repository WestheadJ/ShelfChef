import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRecipeContext } from "@/contexts/recipes/RecipeContext";
import { Action, RecipeAIResponse } from "@/types/recipe";
import { reset } from "@/services/db/dbAPI";
import saveRecipe from "@/services/recipes/saveRecipe";
import { useEffect } from "react";
import AppButton from "@/components/ui/Button/AppButton";
import EditableValueRow from "@/components/ui/Recipe/EditableValueRow";
import IngredientPreviewCard from "@/components/ui/Recipe/IngredientPreviewCard";
import SectionTitle from "@/components/ui/Typography/SectionTitle";

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
    }, [data, setInitialRecipe, state.recipeData]);

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
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <SectionTitle title="Recipe Details:" />
                <EditableValueRow
                    value={state.recipeData.name?.value || "Untitled Recipe"}
                    onPress={() => openEditor({ type: "SET_EDITING_TITLE", value: true })}
                    containerStyle={styles.recipeHeaderRow}
                    textStyle={styles.recipeName}
                />

                <SectionTitle title="Book Options:" style={styles.bookOptionsTitle} />

                {["book_title", "author", "pageNumber"].map((field) => (
                    <EditableValueRow
                        key={field}
                        containerStyle={styles.bookOptionRow}
                        onPress={() => openEditor({ type: "SET_EDITING_BOOK_FIELD", field: field as any })}
                        label={field === "book_title" ? "Book Title: " : field === "author" ? "Author: " : "Page Number: "}
                        value={String(state.recipeData!.book[field]?.value ?? state.recipeData!.book[field] ?? "None")}
                        textStyle={styles.bookOptionText}
                        iconSize={14}
                    />
                ))}

                <SectionTitle title="Ingredients:" style={styles.ingredientsTitle} />
                {state.recipeData.ingredients?.map((ing: any, i: number) => (
                    <IngredientPreviewCard
                        key={i}
                        ingredient={ing}
                        onPress={() => {
                            dispatch({ type: "SET_SAVE", value: false });
                            openEditor({ type: "SET_EDITING", index: i });
                        }}
                    />
                ))}

            </ScrollView>

            <View style={styles.bottomActions}>
                <AppButton
                    title="Cancel"
                    style={styles.cancelButton}
                    onPress={() => {
                        dispatch({ type: "RESET_ALL" });
                        router.push("/capture");
                    }}
                />

                <AppButton
                    title="Save Recipe"
                    style={styles.saveButton}
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
                />
            </View>

            <AppButton
                title="Reset DB"
                style={styles.resetButton}
                onPress={async () => { await reset(); router.push("/capture") }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        padding: 20,
        marginBottom: 80
    },
    recipeHeaderRow: {
        gap: 10,
        marginTop: 10
    },
    recipeName: {
        fontSize: 20
    },
    bookOptionsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 10
    },
    bookOptionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    bookOptionText: {
        fontSize: 16
    },
    ingredientsTitle: {
        marginTop: 30
    },
    bottomActions: {
        position: "absolute",
        bottom: 2,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        paddingBottom: 20
    },
    cancelButton: {
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8
    },
    saveButton: {
        backgroundColor: "black",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8
    },
    resetButton: {
        position: "absolute",
        top: 0,
        right: 1,
        backgroundColor: "black"
    }
});
