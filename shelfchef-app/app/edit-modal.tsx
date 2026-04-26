import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useRecipeContext } from "@/contexts/recipes/RecipeContext";
import { EditIngredientCard } from "@/components/ui/EditIngredient/EditIngredientCard";
import { IngredientField } from "@/types/recipe";
import { useEffect } from "react";
import LabeledTextInput from "@/components/ui/Form/LabeledTextInput";
import SectionTitle from "@/components/ui/Typography/SectionTitle";
import AppButton from "@/components/ui/Button/AppButton";

export default function EditModal() {
    const { state, dispatch } = useRecipeContext();

    // ✅ RESTORED: This fires ONLY when the swipe-down animation is completely finished.
    // This unlocks the buttons on the preview screen.
    useEffect(() => {
        return () => {
            dispatch({ type: "CLEANUP_EDITING" });
        };
    }, [dispatch]);

    const handleDone = () => {
        router.back();
    };

    const updateIngredient = (index: number, field: IngredientField, value: any) => {
        dispatch({ type: "UPDATE_FIELD", index, field, value });
    };

    if (!state.recipeData) {
        return null;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Details</Text>
                <TouchableOpacity onPress={handleDone}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {state.editingTitle && (
                    <LabeledTextInput
                        label="Recipe Name"
                        value={state.recipeData.name?.value ?? ""}
                        autoFocus
                        autoCapitalize="words"
                        onChangeText={(text) => dispatch({ type: "UPDATE_RECIPE_NAME", value: text })}
                    />
                )}

                {state.editingBookField && (
                    <LabeledTextInput
                        label={state.editingBookField.replace("_", " ")}
                        labelStyle={styles.fieldLabelCapitalized}
                        value={String(state.recipeData.book[state.editingBookField]?.value ?? state.recipeData.book[state.editingBookField] ?? "")}
                        autoFocus
                        autoCapitalize="words"
                        keyboardType={state.editingBookField === "pageNumber" ? "numeric" : "default"}
                        onChangeText={(text) => dispatch({ type: "UPDATE_BOOK_FIELD", field: state.editingBookField!, value: text })}
                    />
                )}

                {state.editingIndex !== null && state.recipeData.ingredients[state.editingIndex] && (
                    <View>
                        <SectionTitle title="Editing Ingredient" style={styles.ingredientTitle} />

                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Quantity:" field="quantity"
                            updateIngredient={updateIngredient} keyboardType="numeric"
                            style={styles.ingredientInput}
                        />
                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Unit:" field="unit"
                            updateIngredient={updateIngredient}
                            style={styles.ingredientInput}
                        />
                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Name:" field="name"
                            updateIngredient={updateIngredient}
                            style={styles.ingredientInput}
                        />

                        {state.recipeData.ingredients[state.editingIndex]?.extraDetail?.value ? (
                            <EditIngredientCard
                                ingredient={state.recipeData.ingredients[state.editingIndex]}
                                index={state.editingIndex} label="Extra Detail:" field="extraDetail"
                                updateIngredient={updateIngredient}
                                style={styles.ingredientInput}
                            />
                        ) : (
                            <AppButton
                                title="+ Add Extra Detail"
                                variant="light"
                                style={styles.addDetailButton}
                                onPress={() => dispatch({ type: "ADD_EXTRA_DETAIL", index: state.editingIndex! })}
                                textStyle={styles.addDetailText}
                            />
                        )}
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    doneText: {
        fontSize: 16,
        color: "blue",
        fontWeight: "600"
    },
    content: {
        padding: 20
    },
    fieldLabelCapitalized: {
        textTransform: "capitalize"
    },
    ingredientTitle: {
        marginBottom: 15,
        fontSize: 16
    },
    ingredientInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 8
    },
    addDetailButton: {
        marginTop: 20,
        alignSelf: "flex-start",
        backgroundColor: "#eee"
    },
    addDetailText: {
        color: "black",
        fontWeight: "500"
    }
});
