import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import Calendar from "@/components/Calendar";
import icons from "@/constants/icons";
import { router } from "expo-router";

const OutfitCalendar = () => {
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <TouchableOpacity
        onPress={() => router.push("/OutfitPlanning/Collections")}
        className="flex-row items-center px-5 justify-end"
      >
        <Image source={icons.collectionsAdd} className="size-5" />
      </TouchableOpacity>

      <Calendar />
    </SafeAreaView>
  );
};

export default OutfitCalendar;
