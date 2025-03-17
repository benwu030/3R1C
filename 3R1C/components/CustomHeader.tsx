import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import icons from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  editableTitle?: boolean;
  onTitleChange?: (newTitle: string) => void;
  fontSize?: string;
}

const CustomHeader = ({
  title,
  showBackButton = true,
  rightComponent,
  onBackPress,
  editableTitle = false,
  onTitleChange,
  fontSize = "2xl",
}: CustomHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  useEffect(() => {
    setNewTitle(title);
  }, [title]);
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleTitleSubmit = () => {
    if (onTitleChange && newTitle !== title) {
      onTitleChange(newTitle);
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };
  return (
    <View className="flex-row justify-center items-center py-2 px-5">
      {showBackButton ? (
        <TouchableOpacity onPress={handleBack} className="pr-3 flex-1">
          <Image source={icons.rightArrow} className="w-6 h-6 rotate-180" />
        </TouchableOpacity>
      ) : (
        <Text className=" flex-1 "></Text>
      )}

      {/* Title */}
      <View className="flex-col flex-1 justify-center items-center">
        {editableTitle ? (
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            onBlur={handleTitleSubmit}
            onSubmitEditing={handleTitleSubmit}
            className="font-S-ExtraLightItalic text-2xl"
          />
        ) : (
          <Text className={`font-S-ExtraLightItalic text-${fontSize}`}>
            {title}
          </Text>
        )}

        <Image source={icons.headerUnderline} className="w-full h-4" />
      </View>

      {rightComponent ? (
        <View className="flex-1 justify-end items-end">{rightComponent}</View>
      ) : (
        <Text className=" flex-1 "></Text>
      )}
    </View>
  );
};

export default CustomHeader;
