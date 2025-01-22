import React, { useEffect, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useLocalSearchParams, Link, router } from 'expo-router'
import icons from '@/constants/icons'
import ClothesCard from '@/components/ClothesCard'
import Filters from '@/components/Filters'
import { useAppwrite } from '@/lib/useAppWrite'
import { getClothesWithFilter } from '@/lib/AppWrite'
import { MainCategoriesFilter } from '@/components/CategoriesFilter'
import { CATEGORIES } from '@/constants/data'
//columnwraooer -> row
//contentContainer over content area
const totalNumberClothes = "3"
const index = () => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string}>()
  const {data:clothes,loading,refetch} = useAppwrite({fn:getClothesWithFilter})
  const handleCardPressed = (id:string)=>{
    console.log('card pressed',id)
    router.push(`/details/${id}`)
  }
  useFocusEffect(
    useCallback(() => {
      // Invoked whenever the route is focused.
      refetch()      
    }, []));
  
  useEffect(()=>{
    console.log('main Cate filter',params.mainCategoryfilter)
    refetch({mainCategoryfilter: params.mainCategoryfilter ?? ''})
  },[params.mainCategoryfilter])
   
  
  return (

    <SafeAreaView className='bg-sand-dark flex-1'>

      <View className='flex-row justify-center items-center py-2 px-5'>
        <Text className=' flex-1 '></Text>
        <View className='flex-col flex-1 justify-center items-center'>
          <Text className='font-S-ExtraLightItalic text-3xl'>Your Closet</Text>
          <Image source={icons.headerUnderline} className='w-full h-4' />
        </View>
        <View className='flex-1 justify-end items-end'>
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
        <MainCategoriesFilter Categories = {CATEGORIES}/>

      </View>
      {loading ? (
        <ActivityIndicator className='text-beige-darker mt-[16rem]' size='large' />
      ) : (
        <FlatList
          data={clothes}
          renderItem={({item}: {item: any}) => (
            <View className='w-1/2 px-2'>
              <ClothesCard key={item.$id} item={item} onPress={() => handleCardPressed(item.$id!)} />
            </View>
          )}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{marginHorizontal: 20, flexDirection: 'row'}}
          showsVerticalScrollIndicator={false}
          horizontal={false}
        />
      )}

        

    </SafeAreaView>
  )
}

export default index