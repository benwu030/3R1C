import { useGlobalContext } from "@/lib/globalProvider";
import { Redirect, Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
export default function AppLayout() {
  const { isLoggedIn, loading, isOfflineMode } = useGlobalContext();
  if (loading) return <LoadingScreen />;
  if (!isLoggedIn && !isOfflineMode) {
    return <Redirect href="/signIn" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="(modals)"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="outfit/[outfitId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Utils/EditImage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
