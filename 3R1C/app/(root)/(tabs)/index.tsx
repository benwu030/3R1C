import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import icons from '@/constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClothesCard from '@/components/ClothesCard'
import { CLOTHES } from '@/constants/data'
import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import Filters from '@/components/Filters'
import CategoriesFilter from '@/components/CategoriesFilter'
//columnwraooer -> row
//contentContainer over content area
const totalNumberClothes = "4000"
const index = () => {

  const [isSearch, setisSearch] = useState(false)
  return (

    <SafeAreaView className='bg-sand-dark flex-1'>

      <View className='justify-center items-center py-2 px-5'>
        <View className='flex-col  justify-center items-center'>
          <Text className='font-S-ExtraLightItalic text-4xl w-full'>Your Closet</Text>
          <Image source={icons.headerUnderline} className='w-full h-0.5 py-2' />
        </View>
      </View>

      <View className='flex-row justify-between items-center px-5'>
        <Text className='text-base font-S-Regular'>{totalNumberClothes} Clothes</Text>
        <Filters/>
      </View>

      <View className='px-5'>
        <CategoriesFilter/>
      </View>

        <FlatList data={[CLOTHES[0],CLOTHES[0],CLOTHES[0],CLOTHES[0],CLOTHES[0],CLOTHES[0],CLOTHES[0]]} renderItem={({item})=>( 
            <View className='w-1/2 px-2'>
              <ClothesCard item={item}></ClothesCard>
            </View>
            
       )} 
              numColumns={2}

              contentContainerClassName=""
              columnWrapperClassName="mx-5 flex-row"
              showsVerticalScrollIndicator={false}
              horizontal={false}
        />
       
    </SafeAreaView>
  )
}

export default index