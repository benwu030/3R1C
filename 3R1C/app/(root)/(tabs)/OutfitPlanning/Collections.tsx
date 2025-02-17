import { View, Text,SafeAreaView } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import { Image } from 'expo-image'
import OutfitCollection from '@/components/OutfitCollection'
const OutfitCollections = () => {
  return (
  <SafeAreaView className='bg-sand-dark flex-1'>
   
    <View className='flex-row justify-center items-center py-2 px-5'>
      <Text className=' flex-1 '></Text>
      <View className='flex-col flex-1 justify-center items-center'>
        <Text className='font-S-ExtraLightItalic text-3xl'>Your Outfits</Text>
        <Image source={icons.headerUnderline} className='w-full h-4' />
      </View>
      <Text className=' flex-1 '></Text>

    </View>
    {/* fetch Collections Here*/}
    <View className='px-5'>
      <OutfitCollection title="Christmas Outfit"/>
    </View>
    


  </SafeAreaView>
  )
}

export default OutfitCollections