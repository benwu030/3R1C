import { Tabs,Stack } from "expo-router";
import { View,Text,ImageSourcePropType, Touchable, TouchableOpacity } from "react-native";
import icons from "@/constants/icons";
import { Image } from 'expo-image';
const TabIcon = ({focused,icon,title}:{focused:boolean; icon:ImageSourcePropType; title:string} )=>{
    return(
    <View className="flex-1 mt-3 flex-col items-center">
        <Image
          source={icon}
          tintColor={focused ? "#776E65" : "#ffffff"}
          className="size-8"
        />
        <Text
          className={`${
            focused
              ? "text-sand-deep font-S-Bold"
              : "text-white font-S-Regular"
          } text-xs w-full text-center mt-1 whitespace-nowrap`}
        >
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
          backgroundColor: "#dfd5cb",
          position: "absolute",
          borderTopColor: "#ffffff",
          borderTopWidth: 1,
          minHeight: 80,
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
            <TabIcon focused={focused} icon={icons.sketchbook} title="Planning" />
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
            <TabIcon focused={focused} icon={icons.budget} title="Spending" />
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
