import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    value: string;
    editing: boolean;
    onEdit: () => void;
    onChange: (text: string) => void;
    onDone: () => void;
};

export default function RecipeTitle({
    value,
    editing,
    onEdit,
    onChange,
    onDone
}: Props) {
    if (editing) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "100%"
                }}
            >
                <TextInput
                    value={value}
                    multiline
                    autoFocus
                    onChangeText={onChange}
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        borderBottomWidth: 1,
                        borderColor: "#ccc",
                        minWidth: 150
                    }}
                />

                <TouchableOpacity
                    style={{
                        width: 25,
                        height: 25,
                        borderRadius: 100,
                        backgroundColor: "lightgray",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={onDone}
                >
                    <Ionicons name="checkmark" size={16} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
            }}
            onPress={onEdit}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 20,
                    textAlign: "center"
                }}
            >
                {value || "Untitled Recipe"}
            </Text>

            <Ionicons
                name="pencil"
                size={16}
                color="gray"
                style={{
                    backgroundColor: "lightgray",
                    borderRadius: 100,
                    padding: 5
                }}
            />
        </TouchableOpacity>
    );
}