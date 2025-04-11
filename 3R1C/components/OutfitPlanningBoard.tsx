import React from "react";
import { View, Text } from "react-native";
import DraggableClothing from "@/components/DraggableClothing";
import { Clothe } from "@/constants/clothes";
import { OutfitItem } from "@/constants/outfit";
import { CombinedOutfitItem } from "@/app/(root)/outfit/[outfitId]";
import { checkAbsoultePath } from "@/lib/LocalStoreManager";

interface OutfitPlanningBoardProps {
  outfitItems: CombinedOutfitItem[];
  boardDimensions: { width: number; height: number };
  onUpdatePosition: (index: string, position: any) => void;
  onRemoveItem: (index: string) => void;
}

const OutfitPlanningBoard = ({
  outfitItems,
  boardDimensions,
  onUpdatePosition,
  onRemoveItem,
}: OutfitPlanningBoardProps) => {
  console.log("OutfitPlanningBoard rendered");
  console.log("outfitItems", outfitItems);
  return (
    <>
      {outfitItems.map((item) => (
        <DraggableClothing
          key={item.instanceId}
          instanceId={item.instanceId}
          imageUri={checkAbsoultePath(item.clothe.localImageURL)}
          initialPosition={item.position}
          onPositionChange={(position) =>
            onUpdatePosition(item.instanceId, position)
          }
          onRemoveItem={() => onRemoveItem(item.instanceId)}
          boardDimensions={boardDimensions}
        />
      ))}

      {outfitItems.length === 0 && (
        <View className="absolute inset-0 flex items-center justify-center">
          <Text className="text-gray-400 text-center font-S-Regular">
            Add clothes from your wardrobe{"\n"}to create an outfit
          </Text>
        </View>
      )}
    </>
  );
};

export default React.memo(OutfitPlanningBoard);
