import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    item: any;
    onPress: () => void;
};

export default function RecentRecipeCard({ item, onPress }: Props) {
    const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];

    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={1}>
            <Text style={styles.title}>{item.recipeName}</Text>

            <Text style={styles.bookText}>
                {item.bookTitle ? `Book: ${item.bookTitle}` : "Unknown Book"}
                {item.authorName ? ` by ${item.authorName}` : ""}
                {item.page_number ? ` (Page ${item.page_number})` : ""}
            </Text>

            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>Prep: {item.prep_time || "--"} </Text>
                <Text style={styles.timeText}>Cook: {item.cook_time || "--"} </Text>
                <Text style={styles.timeText}>Total: {item.total_time || "--"} min</Text>
            </View>

            <View style={styles.ingredientsContainer}>
                {ingredients.slice(0, 5).map((ingredient: string, index: number) => (
                    <Text key={`${ingredient}-${index}`} style={styles.ingredient}>
                        {ingredient}
                    </Text>
                ))}
                {ingredients.length > 5 && (
                    <Text style={styles.ingredient}>
                        +{ingredients.length - 5} more
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 16
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
    }
});
