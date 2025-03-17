import { useGlobalContext } from "@/lib/globalProvider";
import { Redirect, Slot, Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
export default function Layout() {
  const { isLoggedIn, loading, isOfflineMode } = useGlobalContext();
  if (loading) return <LoadingScreen />;
  // console.log(!isLoggedIn||!isOfflineMode)
  if (!isLoggedIn && !isOfflineMode) {
    return <Redirect href="/signIn" />;
  }
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="SpendingLimitHome"
    >
      <Slot />
    </Stack>
  );
}
