import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReducer } from "react";
import { EditIngredientCard } from "@/components/ui/EditIngredient/EditIngredientCard";
import { CardDetail } from "@/components/ui/EditIngredient/CardDetail";
import { IngredientField, State, Action, RecipeAIResponse } from "@/types/recipe";
import RecipeTitle from "@/components/ui/EditIngredient/RecipeTitle";


function reducer(state: State, action: Action): State {
    switch (action.type) {

        case "SET_EDITING":
            return {
                ...state,
                editingIndex: action.index
            };

        case "SET_EDITING_TITLE":
            return {
                ...state,
                editingTitle: action.value
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

        case "UPDATE_RECIPE_NAME":
            if (!state.recipeData) return state;

            return {
                ...state,
                recipeData: {
                    ...state.recipeData,
                    name: {
                        ...state.recipeData.name,
                        value: action.value,
                        confidence: 0
                    }
                },
                save: true
            };

        case "UPDATE_FIELD": {
            if (!state.recipeData) return state;

            const updatedIngredients = [...state.recipeData.ingredients];

            updatedIngredients[action.index] = {
                ...updatedIngredients[action.index],
                [action.field]: {
                    ...updatedIngredients[action.index][action.field],
                    value: action.value,
                    confidence: 0
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
            const updatedIngredients = [...state.recipeData!.ingredients];

            updatedIngredients[action.index] = {
                ...updatedIngredients[action.index],
                extraDetail: { value: "detail", confidence: 0 }
            };

            return {
                ...state,
                recipeData: {
                    ...state.recipeData!,
                    ingredients: updatedIngredients
                },
                save: true
            };
        }

        case "RESET_ALL":
            return {
                recipeData: null,
                editingIndex: null,
                editingTitle: false,
                editingBookField: null,
                save: false,
            };

        case "SET_EDITING_BOOK_FIELD":
            return {
                ...state,
                editingBookField: action.field
            };

        case "UPDATE_BOOK_FIELD":
            if (!state.recipeData) return state;

            return {
                ...state,
                recipeData: {
                    ...state.recipeData,
                    book: {
                        ...state.recipeData.book,
                        [action.field]:
                            action.field === "pageNumber"
                                ? {
                                    ...state.recipeData.book.pageNumber,
                                    value: action.value,
                                    confidence: 0
                                }
                                : action.value
                    }
                },
                save: true
            };

        default:
            return state;
    }
}

function normalizeRecipe(data: any): RecipeAIResponse {
    if (!data) return data;

    // If already migrated, return as-is
    if (data.book) return data;

    const { pageNumber, ...rest } = data;

    return {
        ...rest,
        book: {
            book_title: "",
            author: "",
            pageNumber: pageNumber ?? {
                value: null,
                confidence: 0
            }
        }
    };
}

export default function Preview() {

    const { data } = useLocalSearchParams();
    const parsed = data ? normalizeRecipe(JSON.parse(data as string)) : null;

    const [state, dispatch] = useReducer(reducer, {
        recipeData: parsed,
        editingIndex: null,
        editingTitle: false,
        editingBookField: null,
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

    console.log(JSON.stringify(state.recipeData, null, 2));

    return (
        <View style={{ flex: 1 }}>

            <ScrollView style={{ padding: 20, marginBottom: 10 }}>

                {/* Title Section */}

                <RecipeTitle
                    value={state.recipeData.name?.value ?? ""}
                    editing={state.editingTitle}
                    onEdit={() => dispatch({ type: "SET_EDITING_TITLE", value: true })}
                    onChange={(text) =>
                        dispatch({ type: "UPDATE_RECIPE_NAME", value: text })
                    }
                    onDone={() =>
                        dispatch({ type: "SET_EDITING_TITLE", value: false })
                    }
                />

                {/* Book Options */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
                    Book Options:
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    {state.editingBookField === "book_title" ? (
                        <>
                            <TextInput
                                value={state.recipeData.book.book_title}
                                autoFocus
                                onChangeText={(text) =>
                                    dispatch({
                                        type: "UPDATE_BOOK_FIELD",
                                        field: "book_title",
                                        value: text
                                    })
                                }
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: "#ccc",
                                    flex: 1
                                }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({ type: "SET_EDITING_BOOK_FIELD", field: null })
                                }
                            >
                                <Ionicons name="checkmark" size={16} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={{ flex: 1 }}>
                                Book Title: {state.recipeData.book.book_title || "None"}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({
                                        type: "SET_EDITING_BOOK_FIELD",
                                        field: "book_title"
                                    })
                                }
                            >
                                <Ionicons name="pencil" size={14} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    {state.editingBookField === "author" ? (
                        <>
                            <TextInput
                                value={state.recipeData.book.author}
                                autoFocus
                                onChangeText={(text) =>
                                    dispatch({
                                        type: "UPDATE_BOOK_FIELD",
                                        field: "author",
                                        value: text
                                    })
                                }
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: "#ccc",
                                    flex: 1
                                }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({ type: "SET_EDITING_BOOK_FIELD", field: null })
                                }
                            >
                                <Ionicons name="checkmark" size={16} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={{ flex: 1 }}>
                                Author: {state.recipeData.book.author || "None"}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({
                                        type: "SET_EDITING_BOOK_FIELD",
                                        field: "author"
                                    })
                                }
                            >
                                <Ionicons name="pencil" size={14} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    {state.editingBookField === "pageNumber" ? (
                        <>
                            <TextInput
                                value={
                                    state.recipeData.book.pageNumber?.value !== null
                                        ? String(state.recipeData.book.pageNumber.value)
                                        : ""
                                }
                                autoFocus
                                onChangeText={(text) =>
                                    dispatch({
                                        type: "UPDATE_BOOK_FIELD",
                                        field: "pageNumber",
                                        value: text

                                    })
                                }
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: "#ccc",
                                    flex: 1
                                }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({ type: "SET_EDITING_BOOK_FIELD", field: null })
                                }
                            >
                                <Ionicons name="checkmark" size={16} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={{ flex: 1 }}>
                                Page Number: {state.recipeData.book.pageNumber?.value ?? "None"}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    dispatch({
                                        type: "SET_EDITING_BOOK_FIELD",
                                        field: "pageNumber"
                                    })
                                }
                            >
                                <Ionicons name="pencil" size={14} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Ingredients */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Ingredients:</Text>
                {state.recipeData.ingredients?.map((ing: any, i: number) => {

                    const isEditing = i === state.editingIndex;
                    const Wrapper: any = isEditing ? View : TouchableOpacity;

                    return (
                        <Wrapper
                            key={i}
                            style={{
                                marginTop: 12,
                                borderWidth: 1,
                                borderColor: isEditing ? "blue" : "#eee",
                                padding: 12,
                                borderRadius: 8,
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
                                        label="Quantity:"
                                        field="quantity"
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
                                        label="Unit:"
                                        field="unit"
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
                                        label="Name:"
                                        field="name"
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
                                            label="Extra Detail:"
                                            field="extraDetail"
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
                                        <Ionicons name="close" size={18} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    <View style={{ gap: 6 }}>
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
                                </View>
                            )}

                        </Wrapper>
                    );
                })}

            </ScrollView>

            {/* Footer Buttons */}

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
                        borderRadius: 8
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
                        borderRadius: 8
                    }}
                >
                    <Text style={{ color: "white" }}>Save Recipe</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}