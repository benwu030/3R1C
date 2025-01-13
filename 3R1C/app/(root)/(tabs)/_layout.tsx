import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImageSourcePropType } from "react-native";
import { View,Text } from "react-native";
import icons from "@/constants/icons";
import { Image } from 'expo-image';
const TabIcon = ({focused,icon,title}:{focused:boolean; icon:ImageSourcePropType; title:string} )=>{
    return(
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
          source={icon}
          tintColor={focused ? "#0061FF" : "#666876"}
          className="size-5"
        />
        {/* <Text
          className={`${
            focused
              ? "text-primary-300 font-rubik-medium"
              : "text-black-200 font-rubik"
          } text-xs w-full text-center mt-1`}
        > */}
        <Text className="text-xs font-S-Light color-white">
          {title}
        </Text>
      </View>)
}


export default function TabsLayout() {
  return (    
  <Tabs  
    screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}>
    <Tabs.Screen name="index" options={{ title: 'Closet', tabBarIcon:({focused}) =>(
        <TabIcon focused = {focused} icon = {icons.closet} title="Closet"/>
  )}} />
        <Tabs.Screen
        name="OutfitPlanning"
        options={{
          title: "OutfitPlanning",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.mirror} title="OutfitPlanning" />
          ),
        }}
      />
      <Tabs.Screen
        name="TryOn"
        options={{
          title: "Try On",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.mirror} title="Try On" />
          ),
        }}
      />
      <Tabs.Screen
        name="SpendingLimit"
        options={{
          title: "SpendingLimit",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} title="SpendingLimit" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} title="Profile" />
          ),
        }}
      />
  </Tabs>
  );
}
