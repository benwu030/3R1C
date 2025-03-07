import React from "react";
import { View, Text } from "react-native";
import DraggableClothing from "@/components/DraggableClothing";
import { Clothe } from "@/constants/clothes";
import { OutfitItem } from "@/constants/outfit";

interface OutfitPlanningBoardProps {
  selectedClothes: Clothe[];
  outfitItems: OutfitItem[];
  boardDimensions: { width: number; height: number };
  onUpdatePosition: (index: number, position: any) => void;
  onRemoveItem: (index: number) => void;
}

const OutfitPlanningBoard = ({
  selectedClothes,
  outfitItems,
  boardDimensions,
  onUpdatePosition,
  onRemoveItem,
}: OutfitPlanningBoardProps) => {
  return (
    <>
      {selectedClothes.map((clothe, index) => (
        <DraggableClothing
          key={`${clothe.$id}-${index}`}
          imageUri={clothe.localImageURL}
          initialPosition={outfitItems[index]?.position}
          onPositionChange={(position) => onUpdatePosition(index, position)}
          onRemoveItem={() => onRemoveItem(index)}
          boardDimensions={boardDimensions}
        />
      ))}

      {selectedClothes.length === 0 && (
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
