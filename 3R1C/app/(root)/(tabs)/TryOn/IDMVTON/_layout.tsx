import { useGlobalContext } from "@/lib/globalProvider";
import { Redirect, Slot, Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
export default function Layout() {
  const { isLoggedIn, loading, isOfflineMode } = useGlobalContext();
  if (loading) return <LoadingScreen />;
  if (!isLoggedIn && !isOfflineMode) {
    return <Redirect href="/signIn" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="PickModel">
      <Stack.Screen name="PickModel" />
      <Stack.Screen name="PickGarment" />
      <Stack.Screen name="Result" />
    </Stack>
  );
}
