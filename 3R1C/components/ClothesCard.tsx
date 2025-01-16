import { View, Text, Touchable, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Image, ImageSource } from 'expo-image'
// import { Image } from 'react-native';
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

interface Props{
    item: { title: string, image: ImageSource, price: string, createDate: string },
    onPress?:()=>void
}
const ClothesCard = ({item:{image,title,price,createDate},onPress}:Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex-1  relative'>
      <View className='flex-col items-center justify-center mt-2'>
        <View className='flex-row items-center absolute px-2 top-5 right-5 bg-stone-300 p-1 rounded-full z-50'>
            <Text className='text-xs font-S-Bold text-zinc-600 ml-1'>{price}</Text>
        </View>
        <Image source={image} className="w-full h-60" />
      <View className='flex-col items-center justify-center mt-2'>
        <Text className='font-S-Regular text-black text-xl'>{title}</Text>
        <Text className='font-S-Medium text-beige-darker text-sm'>{createDate}</Text>
      </View>
    </View>
    </TouchableOpacity>
  )
}

export default ClothesCard