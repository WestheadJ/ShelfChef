import { Stack } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";
import { RecipeProvider, useRecipeContext } from "../features/recipes/RecipeContext";
import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { Colors } from "@/constants/theme";

function RecipeGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();

  const { recipes, loadRecipes } = useRecipeContext();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function guard() {
      const stored = await loadRecipes();

      if (!stored || stored.length === 0) {
        if (segments[0] !== "capture") {
          router.replace("/capture");
        }
      }

      setChecking(false);
    }

    guard();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading app...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RecipeProvider>
      <RecipeGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </RecipeGuard>
    </RecipeProvider>
  );
}