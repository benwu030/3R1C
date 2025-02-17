import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
interface CollectionProps {
  title: string
  imageUrl?: string
  onPress?: () => void
}

const OutfitCollection = ({ title, imageUrl, onPress }: CollectionProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-[160px] m-2"
    >
      <View className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }}
            className="w-full h-full"
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400">無相片</Text>
          </View>
        )}
      </View>
      <Text className="mt-2 font-S-Medium text-center">{title}</Text>
    </TouchableOpacity>
  )
}

export default OutfitCollection