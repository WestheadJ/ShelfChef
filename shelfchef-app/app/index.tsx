import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { reset, getRecentRecipes, getIngredients } from "@/services/db/dbAPI";

export default function Home() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchRecipes = async () => {
                try {
                    const data = await getRecentRecipes(10);
                    if (isActive) {
                        setRecipes(data);
                        // If no recipes exist, automatically go to the camera
                        if (data.length === 0) {
                            router.replace("/capture?fromHome=true");
                        }
                    }
                } catch (error) {
                    console.error("Error fetching recipes:", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };



            fetchRecipes();


            return () => {
                isActive = false; // Cleanup to prevent state updates if unmounted
            };
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading recipes...</Text>
            </View>
        );
    }

    return (
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
                        <TouchableOpacity onPress={() => router.push({ pathname: "/preview", params: item })} style={styles.card}>
                            <Text style={styles.title}>{item.recipeName}</Text>

                            <Text style={styles.bookText}>
                                {item.bookTitle ? `Book: ${item.bookTitle}` : "Unknown Book"}
                                {item.authorName ? ` by ${item.authorName}` : ""}
                                {item.page_number ? ` (Page ${item.page_number})` : ""}
                            </Text>

                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>Prep: {item.prep_time || '--'} </Text>
                                <Text style={styles.timeText}>Cook: {item.cook_time || '--'} </Text>
                                <Text style={styles.timeText}>Total: {item.total_time || '--'} minutes</Text>
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
                    )}
                />


            )}
            <TouchableOpacity
                style={{ position: "absolute", bottom: 5, left: 10, backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                onPress={() => {
                    router.push({ pathname: "/capture", params: { fromHome: true } });
                }}
            >
                <Text style={{ color: "white" }}>Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ position: "absolute", bottom: 5, right: 10, backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                onPress={async () => { await reset(); setRecipes([]); router.push("/capture") }}
            >
                <Text style={{ color: "white" }}>Reset DB</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#222",
        borderRadius: 12
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android drop shadow
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
        gap: 6 // modern RN supports this, otherwise use margin
    },
    ingredient: {
        backgroundColor: "#eee",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12
    }
});