import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
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
}

const CustomHeader = ({
  title,
  showBackButton = true,
  rightComponent,
  onBackPress,
  editableTitle = false,
  onTitleChange,
}: CustomHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleTitilePress = () => {
    if (editableTitle) {
      setIsEditing(true);
    }
  };
  const handleTitleSubmit = () => {
    if (onTitleChange && newTitle !== title) {
      onTitleChange(newTitle);
    }
    setIsEditing(false);
  };
  return (
    <View className="flex-row justify-between items-center px-5">
      {showBackButton && (
        <TouchableOpacity onPress={handleBack} className="pr-3 flex-1">
          <Image source={icons.rightArrow} className="w-6 h-6 rotate-180" />
        </TouchableOpacity>
      )}

      {/* Title */}
      <View className="flex-col flex-1 justify-center items-center">
        {isEditing ? (
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            onBlur={handleTitleSubmit}
            onSubmitEditing={handleTitleSubmit}
            autoFocus
            selectTextOnFocus
            className="font-S-ExtraLightItalic text-2xl"
          />
        ) : (
          <TouchableOpacity onPress={handleTitilePress}>
            <Text className="font-S-ExtraLightItalic text-2xl">{title}</Text>
          </TouchableOpacity>
        )}

        <Image source={icons.headerUnderline} className="w-full h-4" />
      </View>
      <View className="flex-1 items-end">
        {rightComponent ?? <Text></Text>}
      </View>
    </View>
  );
};

export default CustomHeader;
