import { Tabs } from "expo-router";
import { View,Text,ImageSourcePropType} from "react-native";
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
  
      <Tabs>
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
