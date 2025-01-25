import { Tabs } from "expo-router";
import { View,Text,ImageSourcePropType} from "react-native";
import icons from "@/constants/icons";
import { Image } from 'expo-image';
import React,{createContext,useContext} from 'react'
//TODO 
// interface TabBarLayoutProps{
//   width:number
//   height:number
// }
// const TabBarLayoutContext = createContext<TabBarLayoutProps>({width:0,height:0})
// export const useTabBarLayoutContext = () => useContext(TabBarLayoutContext)
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
const ClosetIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} icon={icons.closet} title="Closet" />
);
const PlanningIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} icon={icons.sketchbook} title="Planning" />
);

const TryOnIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} icon={icons.mirror} title="Try On" />
);

const SpendingIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} icon={icons.budget} title="Spending" />
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} icon={icons.profile} title="Profile" />);
export default function TabLayout() {
return (
  
      <Tabs screenOptions={{       
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#dfd5cb",
          position: "absolute",
          minHeight: 80,
        }}}>
        <Tabs.Screen
        name="index"
        
        options={{
          title: "Closet",
          tabBarIcon: ClosetIcon,
        }}
      />
        <Tabs.Screen
        name="OutfitPlanning"
        options={{
          title: "OutfitPlanning",
          tabBarIcon: PlanningIcon,
        }}
      />
      <Tabs.Screen
        name="TryOn"
        options={{
          title: "Try On",
          tabBarIcon: TryOnIcon,
        }}
      />
      <Tabs.Screen
        name="SpendingLimit"
        options={{
          title: "SpendingLimit",
          tabBarIcon: SpendingIcon,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
     
       <Tabs.Screen
        name="details/[id]"
        options={{
          href:null
        }}
      />
  </Tabs>

 
  );
}
