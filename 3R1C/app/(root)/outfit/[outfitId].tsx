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
// Create context for board dimensions
interface BoardContextType {
  width: number;
  height: number;
}

const BoardContext = createContext<BoardContextType>({ width: 0, height: 0 });

const OutfitPlanning = () => {
  const params = useLocalSearchParams<{
    outfitId: string;
    outfitName: string;
    collectionId: string;
  }>();
  const isNewOutfit = params.outfitName === "New Outfit";
  const { user } = useGlobalContext();

  // State management
  const [title, setTitle] = useState("New Outfit");
  const [selectedClothes, setSelectedClothes] = useState<Clothe[]>([]);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [isSaving, setSaving] = useState(false);
  const [isItemBarOpen, setItemBarOpen] = useState(false);
  const [boardDimensions, setBoardDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Refs
  const viewShotRef = useRef<ViewShot>(null);

  // Get clothes data
  const { data: clothes, loading } = useAppwrite({ fn: getAllClothes });

  // Load existing outfit if editing
  useEffect(() => {
    const loadOutfit = async () => {
      if (!isNewOutfit) {
        try {
          const outfit = await getOutfitById(params.outfitId);
          if (outfit) {
            setTitle(outfit.title);
            setOutfitItems(outfit.items || []);

            // Load clothes for each outfit item
            const outfitClothes = [];
            for (const item of outfit.items) {
              const clothe = clothes?.find((c) => c.$id === item.clotheID);
              if (clothe) outfitClothes.push(clothe);
            }

            setSelectedClothes(outfitClothes);
          }
        } catch (error) {
          console.error("Failed to load outfit:", error);
          Alert.alert("Error", "Could not load outfit data");
        }
      }
    };

    if (clothes && clothes.length > 0) {
      loadOutfit();
    }
  }, [isNewOutfit, params.outfitId, clothes]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleAddClothing = (clothe: Clothe) => {
    setSelectedClothes((prev) => [...prev, clothe]);

    // Add to outfit items with random position
    setOutfitItems((prev) => [
      ...prev,
      {
        clotheID: clothe.$id!,
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

  const handleRemoveItem = (index: number) => {
    setSelectedClothes((prev) => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });

    setOutfitItems((prev) => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleUpdatePosition = (index: number, position: any) => {
    setOutfitItems((prev) => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        position,
      };
      return newItems;
    });
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

      const outfitData: Outfit = {
        $id: isNewOutfit ? null : params.outfitId,
        userid: user?.$id ?? "",
        title,
        items: outfitItems,
        previewImageURL: previewImageURL ?? undefined,
      };
      console.log("Saving outfit:", outfitData);
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
              selectedClothes={selectedClothes}
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
            loading={loading}
            onSelectItem={handleAddClothing}
            onClose={() => setItemBarOpen(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OutfitPlanning;
