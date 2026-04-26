import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { reset, getRecentRecipes, deleteRecipe } from "@/services/db/dbAPI"; // Added deleteRecipe
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch recipes from DB
    const fetchRecipes = async () => {
        try {
            const data = await getRecentRecipes(10);
            setRecipes(data);
            // If no recipes exist, automatically go to the camera
            if (data.length === 0) {
                router.replace("/capture?fromHome=true");
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecipes();
        }, [])
    );

    // Delete Logic
    const handleDelete = (recipeID: number) => {
        Alert.alert("Delete Recipe", "Are you sure you want to remove this from your shelf?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await deleteRecipe(recipeID); // Assuming this exists in your dbAPI
                    fetchRecipes(); // Refresh the list
                }
            },
        ]);
    };

    // The "Underneath" Delete Button
    const renderRightActions = (item: any) => {
        return (
            <TouchableOpacity
                onPress={() => handleDelete(item.recipeID)}
                style={styles.deleteButton}
                activeOpacity={0.7}
            >
                <Ionicons name="trash" size={24} color="white" />
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading recipes...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {recipes.length === 0 ? (
                    <View style={styles.center}>
                        <Text>No recipes yet.</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/capture?fromHome=true")}
                            style={styles.button}
                        >
                            <Text style={{ color: "white" }}>Scan Cookbook</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        keyExtractor={(item) => item.recipeID.toString()}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item }) => (
                            <Swipeable
                                renderRightActions={() => renderRightActions(item)}
                                containerStyle={styles.swipeableContainer}
                            >
                                <TouchableOpacity
                                    onPress={() => router.push({ pathname: "/preview", params: item })}
                                    style={styles.card}
                                    activeOpacity={1} // Prevents card from flickering when swiping
                                >
                                    <Text style={styles.title}>{item.recipeName}</Text>

                                    <Text style={styles.bookText}>
                                        {item.bookTitle ? `Book: ${item.bookTitle}` : "Unknown Book"}
                                        {item.authorName ? ` by ${item.authorName}` : ""}
                                        {item.page_number ? ` (Page ${item.page_number})` : ""}
                                    </Text>

                                    <View style={styles.timeContainer}>
                                        <Text style={styles.timeText}>Prep: {item.prep_time || '--'} </Text>
                                        <Text style={styles.timeText}>Cook: {item.cook_time || '--'} </Text>
                                        <Text style={styles.timeText}>Total: {item.total_time || '--'} min</Text>
                                    </View>

                                    <View style={styles.ingredientsContainer}>
                                        {(Array.isArray(item.ingredients) ? item.ingredients : []).slice(0, 5).map((ingredient: string, index: number) => (
                                            <Text key={`${ingredient}-${index}`} style={styles.ingredient}>
                                                {ingredient}
                                            </Text>
                                        ))}
                                        {(Array.isArray(item.ingredients) && item.ingredients.length > 5) && (
                                            <Text style={styles.ingredient}>
                                                +{item.ingredients.length - 5} more
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        )}
                    />
                )}

                {/* Bottom Buttons */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => router.push({ pathname: "/capture", params: { fromHome: true } })}
                    >
                        <Text style={{ color: "white" }}>Capture</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={async () => { await reset(); setRecipes([]); router.push("/capture") }}
                    >
                        <Text style={{ color: "white" }}>Reset DB</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    swipeableContainer: {
        backgroundColor: "#FF3B30", // The red tray under the card
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden', // This is the magic: clips the card's square edge
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        // borderRadius and marginBottom are handled by swipeableContainer
    },
    deleteButton: {
        width: 80,
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4
    },
    bookText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 12
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 10
    },
    timeText: {
        fontSize: 13,
        color: "#777",
        fontWeight: "500"
    },
    ingredientsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        gap: 6
    },
    ingredient: {
        backgroundColor: "#eee",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#222",
        borderRadius: 12
    },
    bottomActions: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    footerButton: {
        backgroundColor: "black",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: "center"
    }
});