import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import CustomHeader from "@/components/CustomHeader";
import { useLocalSearchParams, router } from "expo-router";
import { useAppwrite } from "@/lib/useAppWrite";
import { getAllClothes } from "@/lib/CRUD/clotheCRUD";
import {
  createOutfit,
  getOutfitById,
  updateOutfit,
} from "@/lib/CRUD/outfitCRUD";
import { Outfit, OutfitItem } from "@/constants/outfit";
import { Clothe } from "@/constants/clothes";
import ViewShot from "react-native-view-shot";
import { ID } from "react-native-appwrite";
import { useGlobalContext } from "@/lib/globalProvider";
import ClotheItemBar from "@/components/ClotheItemBar";
import icons from "@/constants/icons";
import OutfitPlanningBoard from "@/components/OutfitPlanningBoard";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
// Create context for board dimensions
interface BoardContextType {
  width: number;
  height: number;
}

const BoardContext = createContext<BoardContextType>({ width: 0, height: 0 });
export interface CombinedOutfitItem extends OutfitItem {
  clothe: Clothe;
  instanceId: string;
}
const OutfitPlanning = () => {
  const params = useLocalSearchParams<{
    outfitId: string;
    outfitName: string;
    isNewOutfit: string;
    collectionId: string;
  }>();
  const isNewOutfit = params.isNewOutfit === "true";
  const { user } = useGlobalContext();
  // Refs
  const viewShotRef = useRef<ViewShot>(null);

  // Get clothes data
  const { data: clothes, loading: loadingClothes } = useAppwrite({
    fn: getAllClothes,
  });
  //get outfit data
  const {
    data: outfit,
    loading: loadingOutfit,
    refetch,
  } = useAppwrite({
    fn: (params) => getOutfitById(params.id, params.isNew),
    params: { id: params.outfitId, isNew: isNewOutfit },
  });
  // State management
  const [title, setTitle] = useState(outfit?.title ?? "New Outfit");
  const [outfitItems, setOutfitItems] = useState<CombinedOutfitItem[]>([]);
  const [isSaving, setSaving] = useState(false);
  const [isItemBarOpen, setItemBarOpen] = useState(false);
  const [boardDimensions, setBoardDimensions] = useState({
    width: 0,
    height: 0,
  });

  const loadOutfit = () => {
    if (!isNewOutfit) {
      if (outfit) {
        setTitle(outfit.title);
        // Load clothes for each outfit item
        const loadedOutfitItems: CombinedOutfitItem[] = [];
        for (const item of outfit.items) {
          //find the clothe with the id and insert it into the outfit items
          const clothe = clothes?.find((c) => c.$id === item.clotheID);
          if (clothe)
            loadedOutfitItems.push({
              ...item,
              clothe: clothe,
              instanceId: ID.unique(),
            });
          //TODO: handle case where clothe is not found
        }
        setOutfitItems(loadedOutfitItems);
      }
    }
  };
  // Load existing outfit if editing
  useEffect(() => {
    if (clothes && clothes.length > 0) {
      loadOutfit();
    }
  }, [outfit, isNewOutfit, params.outfitId, clothes]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleAddClothing = (clothe: Clothe) => {
    // Add to outfit items with random position
    setOutfitItems((prev) => [
      ...prev,
      {
        clotheID: clothe.$id!,
        clothe: clothe,
        instanceId: ID.unique(),
        position: {
          x: Math.random() * 100 + 50,
          y: Math.random() * 100 + 100,
          scale: 1,
          rotation: 0,
          z: 0,
        },
      },
    ]);

    // Close item bar after selection
    // setItemBarOpen(false);
  };

  const handleRemoveItem = (instanceId: string) => {
    setOutfitItems((prev) =>
      prev.filter((item) => item.instanceId !== instanceId)
    );
  };

  const handleUpdatePosition = (instanceId: string, position: any) => {
    setOutfitItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, position } : item
      )
    );
  };

  const capturePreview = async () => {
    if (!viewShotRef.current) return null;

    try {
      if (viewShotRef.current.capture) {
        return await viewShotRef.current.capture();
      }
      return null;
    } catch (error) {
      console.error("Failed to capture preview:", error);
      return null;
    }
  };

  const handleSaveOutfit = async () => {
    try {
      setSaving(true);
      // Capture preview
      const previewImageURL = await capturePreview();
      //turn combined outfit items into outfit items
      const saveOutfitItems = outfitItems.map((item) => {
        return {
          clotheID: item.clotheID,
          position: item.position,
        };
      });
      const outfitData: Outfit = {
        $id: isNewOutfit ? null : params.outfitId,
        userid: user?.$id ?? "",
        title,
        items: saveOutfitItems,
        previewImageURL: previewImageURL ?? undefined,
      };
      if (isNewOutfit) {
        await createOutfit(outfitData, params.collectionId, () => {
          Alert.alert("Success", "Outfit created successfully!");
          router.back();
        });
      } else {
        await updateOutfit(outfitData, () => {
          Alert.alert("Success", "Outfit updated successfully!");
          router.back();
        });
      }
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save outfit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-sand-dark">
        <CustomHeader
          title={title}
          editableTitle={true}
          onTitleChange={handleTitleChange}
          rightComponent={
            <TouchableOpacity onPress={handleSaveOutfit} disabled={isSaving}>
              <Text className="font-S-Medium text-base">
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          }
        />

        <BoardContext.Provider value={boardDimensions}>
          <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
            <View
              className="bg-white flex-1"
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setBoardDimensions({ width, height });
              }}
            >
              <OutfitPlanningBoard
                outfitItems={outfitItems}
                boardDimensions={boardDimensions}
                onUpdatePosition={handleUpdatePosition}
                onRemoveItem={handleRemoveItem}
              />
            </View>
          </ViewShot>
        </BoardContext.Provider>
        {/* Add button to show item bar */}
        <View className="pb-2">
          <TouchableOpacity
            className="absolute bottom-4 right-4 bg-beige rounded-full p-5 shadow-lg"
            onPress={() => setItemBarOpen(!isItemBarOpen)}
          >
            <Image source={icons.plus} className="w-6 h-6" />
          </TouchableOpacity>

          {/* Item bar */}
          {isItemBarOpen && (
            <ClotheItemBar
              clothes={clothes || []}
              loading={loadingClothes}
              onSelectItem={handleAddClothing}
              onClose={() => setItemBarOpen(false)}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OutfitPlanning;
