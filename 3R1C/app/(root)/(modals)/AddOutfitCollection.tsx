import React from "react";
import CreateOutfitCollectionModal from "@/components/CreateOutfitCollectionModal";
import { useGlobalContext } from "@/lib/globalProvider";
import { View } from "react-native";
export default function AddClothes() {
  const { user } = useGlobalContext();
  return (
    <View className="bg-sand-white flex-auto">
      <CreateOutfitCollectionModal userID={user?.$id ?? ""} />
    </View>
  );
}
