import React from "react";
import CreateClothesModal from "@/components/CreateClothesModal";
import { useGlobalContext } from "@/lib/globalProvider";
import { View } from "react-native";
export default function AddClothes() {
  const { user } = useGlobalContext();
  return (
    <View className="bg-sand-white flex-auto">
      <CreateClothesModal userID={user?.$id ?? ""} />
    </View>
  );
}
