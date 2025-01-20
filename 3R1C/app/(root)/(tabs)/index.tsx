import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Image } from 'expo-image'
import icons from '@/constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClothesCard from '@/components/ClothesCard'
import { CLOTHES } from '@/constants/data'
import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import Filters from '@/components/Filters'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useAppwrite } from '@/lib/useAppWrite'
import { getClothesWithFilter } from '@/lib/AppWrite'
import CreateClothesModal from '@/components/CreateClothesModal'
import { useGlobalContext } from '@/lib/globalProvider'
import { Link } from 'expo-router'
import MainCategoriesFilter from '@/components/MainCategoriesFilter'
import { router } from 'expo-router'
//columnwraooer -> row
//contentContainer over content area
const totalNumberClothes = "4000"
const index = () => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string}>()
  const {data:clothes,loading,refetch} = useAppwrite({fn:getClothesWithFilter})
  const [toggleCreateClothesModal,setToggleCreateClothesModal] = useState(false)
  const handleCardPressed = (id:string)=>{
    console.log('card pressed',id)
    router.push(`/details/${id}`)
  }
  useFocusEffect(()=>{refetch()})
  useEffect(()=>{
    console.log('main Cate filter',params.mainCategoryfilter)
    refetch({mainCategoryfilter: params.mainCategoryfilter || ''})
  },[params.mainCategoryfilter])
    const {user} = useGlobalContext()
  return (

    <SafeAreaView className='bg-sand-dark flex-1'>

      <View className='flex-row justify-center items-center py-2 px-5'>
        <Text className=' mr-auto'></Text>
        <View className='flex-col  justify-center items-center'>
          <Text className='font-S-ExtraLightItalic text-4xl w-full'>Your Closet</Text>
          <Image source={icons.headerUnderline} className='w-full h-4' />
        </View>
        <View className='ml-auto'>
          <Link href="/AddClothes">
          <Image source={icons.plus} className='size-8' />
          </Link>
        </View>
      </View>

      <View className='flex-row justify-between items-center px-5'>
        <Text className='text-base font-S-Regular'>{totalNumberClothes} Clothes</Text>
        <Filters/>
      </View>

      <View className='px-5'>
        <MainCategoriesFilter/>
      </View>

        <FlatList data={clothes} renderItem={({item})=>( 
            <View className='w-1/2 px-2'>
              <ClothesCard key={item.$id} item={item} onPress={() => handleCardPressed(item.$id!)}></ClothesCard>
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