import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import Calendar from "@/components/Calendar";
import icons from "@/constants/icons";
import { router } from "expo-router";

const OutfitCalendar = () => {
  return (
    <SafeAreaView className="bg-sand-dark flex-1 h-screen">
      <Calendar />
    </SafeAreaView>
  );
};

export default OutfitCalendar;
