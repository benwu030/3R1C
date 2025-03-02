import React from "react";
import CreateOutfitCollectionModal from "@/components/CreateOutfitCollectionModal";
import { useGlobalContext } from "@/lib/globalProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function AddClothes() {
  const { user } = useGlobalContext();
  return (
    <GestureHandlerRootView className="bg-sand-white flex-auto">
      <CreateOutfitCollectionModal userID={user?.$id ?? ""} />
    </GestureHandlerRootView>
  );
}
