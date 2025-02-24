import { View, Text,SafeAreaView,TouchableOpacity,ActivityIndicator,FlatList } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import icons from '@/constants/icons'
import { useLocalSearchParams,router } from 'expo-router'
import { getOutfitsByCollection } from '@/lib/CRUD/outfitCRUD'
import { useAppwrite } from '@/lib/useAppWrite'
const Outfits = () => {
  const params = useLocalSearchParams<{collectionId:string}>()
const {data:clothes,loading,refetch} = useAppwrite({fn:getOutfitsByCollection,params:{collection:params.collectionId}})
 const handleCardPressed = (id:string)=>{
    console.log('card pressed',id)
    router.push(`./${id}`)
  }
    return (
        <SafeAreaView className='bg-sand-dark flex-1'>
         
          <View className='flex-row justify-center items-center py-2 px-5'>
            <Text className=' flex-1 '></Text>
            <View className='flex-col flex-1 justify-center items-center'>
              <Text className='font-S-ExtraLightItalic text-2xl'>{params.name}</Text>
              <Image source={icons.headerUnderline} className='w-full h-4' />
            </View>
             <TouchableOpacity  className='flex-1  justify-end items-end'>
                <Image source={icons.plus} className='size-8' />
            </TouchableOpacity>
      
          </View>
          <View className='px-5'>
           {/* create dynamic route to [id].tsx for each outfit card */}
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
          </View>
          
      
      
        </SafeAreaView>
    )
}

export default Outfits