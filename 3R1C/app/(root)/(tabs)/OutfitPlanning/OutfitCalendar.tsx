import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useLocalSearchParams, Link, router } from 'expo-router'
import icons from '@/constants/icons'
import ClothesCard from '@/components/ClothesCard'
import Filters from '@/components/Filters'
import { useAppwrite } from '@/lib/useAppWrite'
import { getClothesWithFilter } from '@/lib/AppWrite'

import Calendar from '@/components/Calendar'

import OutfitPreview from '@/components/OutfitPreview'
const totalNumberClothes = "3"

const OutfitCalendar = () => {
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

    <SafeAreaView className='bg-sand-dark h-screen'>
    
        <Calendar />


    </SafeAreaView>
  )
}

export default OutfitCalendar