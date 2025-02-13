import React, { useEffect, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useLocalSearchParams, Link, router } from 'expo-router'
import icons from '@/constants/icons'
import ClothesCard from '@/components/ClothesCard'
import Filters from '@/components/Filters'
import { useAppwrite } from '@/lib/useAppWrite'
import { getClothesWithFilter } from '@/lib/AppWrite'
import { MainCategoriesFilter } from '@/components/CategoriesFilter'
import { CATEGORIES } from '@/constants/data'
import Calendar from '@/components/Calendar'
//columnwraooer -> row
//contentContainer over content area
const totalNumberClothes = "3"
const OutfitPlanningHome = () => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string}>()
  const {data:clothes,loading,refetch} = useAppwrite({fn:getClothesWithFilter})
  const handleCardPressed = (id:string)=>{
    console.log('card pressed',id)
    router.push(`/details/${id}`)
  }

  
  useEffect(()=>{
 
    refetch({mainCategoryfilter: params.mainCategoryfilter??'All'})

  },[params.mainCategoryfilter])
   
  
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
    <Calendar/>
      

        

    </SafeAreaView>
  )
}

export default OutfitPlanningHome