import { useGlobalContext } from "@/lib/globalProvider";
import { Redirect,Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
export default function Layout(){
    const {isLoggedIn,loading,isOfflineMode} = useGlobalContext()
    if(loading) return <LoadingScreen/>
    // console.log(!isLoggedIn||!isOfflineMode)
    if(!isLoggedIn&&!isOfflineMode){
        return(<Redirect href='/signIn'/>)
    }
    return(
        <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            title: "Outfit Planning",
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="[id]" 
          options={{
            title: "Plan Details",
            headerShown: false,
          }}
        />
      </Stack>
        )
}