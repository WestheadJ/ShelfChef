import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    bookTitle: string;
    author: string;
    pageNumber: number | null;
    editing: boolean;
    onEdit: () => void;
    onDone: () => void;
    onChange: (field: "book_title" | "author" | "pageNumber", value: string) => void;
};

export default function BookDetailsCard({
    bookTitle,
    author,
    pageNumber,
    editing,
    onEdit,
    onDone,
    onChange
}: Props) {
    return (
        <View
            style={{
                marginTop: 12,
                borderWidth: 1,
                borderColor: "#eee",
                padding: 12,
                borderRadius: 8
            }}
        >
            {editing ? (
                <>
                    <TextInput
                        placeholder="Book Title"
                        value={bookTitle}
                        onChangeText={(text) => onChange("book_title", text)}
                        style={{ marginBottom: 8 }}
                    />

                    <TextInput
                        placeholder="Author"
                        value={author}
                        onChangeText={(text) => onChange("author", text)}
                        style={{ marginBottom: 8 }}
                    />

                    <TextInput
                        placeholder="Page Number"
                        keyboardType="numeric"
                        value={pageNumber ? String(pageNumber) : ""}
                        onChangeText={(text) =>
                            onChange("pageNumber", text)
                        }
                    />

                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            alignSelf: "flex-end"
                        }}
                        onPress={onDone}
                    >
                        <Ionicons name="checkmark-circle" size={22} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={onEdit}
                        style={{ alignSelf: "flex-end" }}
                    >
                        <Ionicons name="pencil" size={16} />
                    </TouchableOpacity>

                    <Text>Book Title: {bookTitle || "None"}</Text>
                    <Text>Author: {author || "Unknown"}</Text>
                    <Text>
                        Page Number: {pageNumber ?? "None"}
                    </Text>
                </>
            )}
        </View>
    );
}