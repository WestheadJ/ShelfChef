import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipeContext } from "@/contexts/recipes/RecipeContext";
import { EditIngredientCard } from "@/components/ui/EditIngredient/EditIngredientCard";
import { IngredientField } from "@/types/recipe";
import { useEffect } from "react";

export default function EditModal() {
    const { state, dispatch } = useRecipeContext();

    // ✅ RESTORED: This fires ONLY when the swipe-down animation is completely finished.
    // This unlocks the buttons on the preview screen.
    useEffect(() => {
        return () => {
            dispatch({ type: "CLEANUP_EDITING" });
        };
    }, []);

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
            style={{ flex: 1, backgroundColor: "white" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderColor: "#eee" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Edit Details</Text>
                <TouchableOpacity onPress={handleDone}>
                    <Text style={{ fontSize: 16, color: "blue", fontWeight: "600" }}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }}>
                {state.editingTitle && (
                    <View>
                        <Text style={{ marginBottom: 8, color: "gray" }}>Recipe Name</Text>
                        <TextInput
                            value={state.recipeData.name?.value ?? ""}
                            autoFocus
                            onChangeText={(text) => dispatch({ type: "UPDATE_RECIPE_NAME", value: text })}
                            style={{ fontSize: 18, borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 8 }}
                        />
                    </View>
                )}

                {state.editingBookField && (
                    <View>
                        <Text style={{ marginBottom: 8, color: "gray", textTransform: "capitalize" }}>
                            {state.editingBookField.replace("_", " ")}
                        </Text>
                        <TextInput
                            value={String(state.recipeData.book[state.editingBookField]?.value ?? state.recipeData.book[state.editingBookField] ?? "")}
                            autoFocus
                            keyboardType={state.editingBookField === "pageNumber" ? "numeric" : "default"}
                            onChangeText={(text) => dispatch({ type: "UPDATE_BOOK_FIELD", field: state.editingBookField!, value: text })}
                            style={{ fontSize: 18, borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 8 }}
                        />
                    </View>
                )}

                {state.editingIndex !== null && state.recipeData.ingredients[state.editingIndex] && (
                    <View>
                        <Text style={{ marginBottom: 15, fontSize: 16, fontWeight: "bold" }}>Editing Ingredient</Text>

                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Quantity:" field="quantity"
                            updateIngredient={updateIngredient} keyboardType="numeric"
                            style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 8 }}
                        />
                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Unit:" field="unit"
                            updateIngredient={updateIngredient}
                            style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 8 }}
                        />
                        <EditIngredientCard
                            ingredient={state.recipeData.ingredients[state.editingIndex]}
                            index={state.editingIndex} label="Name:" field="name"
                            updateIngredient={updateIngredient}
                            style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 8 }}
                        />

                        {state.recipeData.ingredients[state.editingIndex]?.extraDetail?.value ? (
                            <EditIngredientCard
                                ingredient={state.recipeData.ingredients[state.editingIndex]}
                                index={state.editingIndex} label="Extra Detail:" field="extraDetail"
                                updateIngredient={updateIngredient}
                                style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 8 }}
                            />
                        ) : (
                            <TouchableOpacity
                                style={{ marginTop: 20, alignSelf: "flex-start", backgroundColor: "#eee", padding: 10, borderRadius: 8 }}
                                onPress={() => dispatch({ type: "ADD_EXTRA_DETAIL", index: state.editingIndex! })}
                            >
                                <Text style={{ color: "black", fontWeight: "500" }}>+ Add Extra Detail</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}