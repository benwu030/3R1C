import { useGlobalContext } from "@/lib/globalProvider";
import { Redirect, Slot,Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout(){
    const {isLoggedIn,loading,isOfflineMode} = useGlobalContext()
    if(loading){
        return(
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                <ActivityIndicator className="text-amber-400 " size="large"/>
            </SafeAreaView>
        )
    }
    console.log(!isLoggedIn||!isOfflineMode)
    if(!isLoggedIn&&!isOfflineMode){
        return(<Redirect href='/signIn'/>)
    }
    return(
    <Stack>
          <Stack.Screen
        name="(modals)"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        </Stack>
        )
}