import { Stack, useRouter, useSegments } from "expo-router";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { RecipeProvider } from "../contexts/recipes/RecipeContext";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/theme";
import { DBProvider, useDBContext } from "@/contexts/DBContext";
import { getRecipeCount } from "@/services/db/dbAPI";

function RecipeGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { ready } = useDBContext();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ready) return;

    async function guard() {
      const stored = await getRecipeCount();
      const allowedWhenEmpty = new Set([
        "capture",
        "confirm",
        "processing",
        "preview",
        "edit-modal"
      ]);

      if (stored?.count === 0) {
        if (!allowedWhenEmpty.has(segments[0] ?? "")) {
          router.replace("/capture");
        }
      }

      setChecking(false);
    }

    guard();

  }, [ready, router, segments]);

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading app...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <DBProvider>
      <RecipeProvider>
        <RecipeGuard>
          <SafeAreaView style={styles.safeArea}>

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="capture" />
              <Stack.Screen name="preview" />

              <Stack.Screen
                name="edit-modal"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  gestureEnabled: true
                }}
              />
            </Stack>
          </SafeAreaView>
        </RecipeGuard>
      </RecipeProvider>
    </DBProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background
  }
});
