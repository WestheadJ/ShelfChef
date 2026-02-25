import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReducer } from "react";
import { EditIngredientCard } from "@/components/ui/EditIngredient/EditIngredientCard";
import { CardDetail } from "@/components/ui/CardDetail";

type IngredientField = "name" | "quantity" | "unit" | "extraDetail";

type State = {
    recipeData: any;
    editingIndex: number | null;
    save: boolean;
};

type Action =
    | { type: "SET_EDITING"; index: number | null }
    | { type: "SET_RECIPE"; payload: any }
    | { type: "UPDATE_FIELD"; index: number; field: IngredientField; value: any }
    | { type: "ADD_EXTRA_DETAIL"; index: number }
    | { type: "SET_SAVE"; value: boolean }
    | { type: "RESET_ALL" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_EDITING":
            return {
                ...state,
                editingIndex: action.index
            };

        case "SET_SAVE":
            return {
                ...state,
                save: action.value
            };

        case "SET_RECIPE":
            return {
                ...state,
                recipeData: action.payload
            };

        case "UPDATE_FIELD": {
            const updatedIngredients = [...state.recipeData.ingredients];

            updatedIngredients[action.index] = {
                ...updatedIngredients[action.index],
                [action.field]: {
                    ...updatedIngredients[action.index][action.field],
                    value: action.value,
                    confidence: 0 // removes confidence when edited (your original behavior)
                }
            };

            return {
                ...state,
                recipeData: {
                    ...state.recipeData,
                    ingredients: updatedIngredients
                },
                save: true
            };
        }

        case "ADD_EXTRA_DETAIL": {
            const updatedIngredients = [...state.recipeData.ingredients];

            updatedIngredients[action.index] = {
                ...updatedIngredients[action.index],
                extraDetail: { value: "detail", confidence: 0 }
            };

            return {
                ...state,
                recipeData: {
                    ...state.recipeData,
                    ingredients: updatedIngredients
                },
                save: true
            };
        }

        case "RESET_ALL":
            return {
                recipeData: null,
                editingIndex: null,
                save: false
            };

        default:
            return state;
    }
}

export default function Preview() {
    const { data } = useLocalSearchParams();
    const parsed = data ? JSON.parse(data as string) : null;

    const [state, dispatch] = useReducer(reducer, {
        recipeData: parsed,
        editingIndex: null,
        save: false
    });

    if (!state.recipeData) return null;

    const updateIngredient = (
        index: number,
        field: IngredientField,
        value: any
    ) => {
        dispatch({ type: "UPDATE_FIELD", index, field, value });
    };

    return (
        <View>
            <ScrollView style={{ padding: 20, marginBottom: 10 }}>
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginTop: 20,
                        textAlign: "center"
                    }}
                >
                    {state.recipeData.name?.value ?? "Untitled Recipe"}
                </Text>

                {state.recipeData.ingredients?.map((ing: any, i: number) => {
                    const isEditing = i === state.editingIndex;
                    const Wrapper: any = isEditing ? View : TouchableOpacity;

                    return (
                        <Wrapper
                            key={i}
                            style={{
                                marginTop: 12,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: isEditing ? "blue" : "#eee",
                                padding: 12,
                                borderRadius: 8,
                                flexDirection: "column",
                                width: "100%"
                            }}
                            {...(!isEditing && {
                                onPress: () => {
                                    dispatch({ type: "SET_EDITING", index: i });
                                    dispatch({ type: "SET_SAVE", value: false });
                                }
                            })}
                        >
                            {isEditing ? (
                                <View>
                                    <EditIngredientCard
                                        ingredient={ing}
                                        index={i}
                                        label={"Quantity:"}
                                        field={"quantity"}
                                        updateIngredient={updateIngredient}
                                        style={{
                                            width: 50,
                                            borderBottomWidth: 1,
                                            borderColor: "#ccc",
                                            padding: 4
                                        }}
                                        keyboardType="numeric"
                                    />

                                    <EditIngredientCard
                                        ingredient={ing}
                                        index={i}
                                        label={"Unit:"}
                                        field={"unit"}
                                        updateIngredient={updateIngredient}
                                        style={{
                                            width: 90,
                                            borderBottomWidth: 1,
                                            borderColor: "#ccc",
                                            padding: 4
                                        }}
                                    />

                                    <EditIngredientCard
                                        ingredient={ing}
                                        index={i}
                                        label={"Name:"}
                                        field={"name"}
                                        updateIngredient={updateIngredient}
                                        style={{
                                            flex: 1,
                                            borderBottomWidth: 1,
                                            borderColor: "#ccc",
                                            padding: 4
                                        }}
                                    />

                                    {ing.extraDetail?.value ? (
                                        <EditIngredientCard
                                            ingredient={ing}
                                            index={i}
                                            label={"Extra Detail:"}
                                            field={"extraDetail"}
                                            updateIngredient={updateIngredient}
                                            style={{
                                                flex: 1,
                                                borderBottomWidth: 1,
                                                borderColor: "#ccc",
                                                padding: 4
                                            }}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            style={{ marginTop: 8 }}
                                            onPress={() =>
                                                dispatch({ type: "ADD_EXTRA_DETAIL", index: i })
                                            }
                                        >
                                            <Text style={{ color: "blue" }}>
                                                Add Extra Detail
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {!state.save ? (
                                        <TouchableOpacity
                                            style={{
                                                position: "absolute",
                                                right: 4,
                                                top: 4,
                                                backgroundColor: "lightgray",
                                                padding: 2,
                                                borderRadius: 100
                                            }}
                                            onPress={() => {
                                                dispatch({ type: "SET_EDITING", index: null });
                                                dispatch({ type: "SET_SAVE", value: false });
                                            }}
                                        >
                                            <Ionicons name="close" size={18} color="black" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                dispatch({ type: "SET_EDITING", index: null });
                                                dispatch({ type: "SET_SAVE", value: false });
                                            }}
                                            style={{
                                                backgroundColor: "#ccc",
                                                padding: 8,
                                                borderRadius: 4
                                            }}
                                        >
                                            <Text>Add Ingredient</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <View style={{ gap: 6, alignItems: "flex-start" }}>
                                    {ing.quantity?.value && (
                                        <CardDetail ingredient={ing} field="quantity" />
                                    )}
                                    {ing.unit?.value && (
                                        <CardDetail ingredient={ing} field="unit" />
                                    )}
                                    {ing.name?.value && (
                                        <CardDetail ingredient={ing} field="name" />
                                    )}
                                    {ing.extraDetail?.value && (
                                        <CardDetail ingredient={ing} field="extraDetail" />
                                    )}
                                </View>
                            )}
                        </Wrapper>
                    );
                })}

                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        alignSelf: "center",
                        backgroundColor: "black",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                        marginBottom: 110
                    }}
                >
                    <Text style={{ color: "white" }}>Add an ingredient</Text>
                </TouchableOpacity>
            </ScrollView>

            <View
                style={{
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    paddingBottom: 20
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "red",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                        opacity: 0.9
                    }}
                    onPress={() => {
                        dispatch({ type: "RESET_ALL" });
                        router.push("/capture");
                    }}
                >
                    <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: "black",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                        opacity: 0.9
                    }}
                >
                    <Text style={{ color: "white" }}>Save Recipe</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}