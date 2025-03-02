import { View, Text,SafeAreaView,TouchableOpacity,ActivityIndicator,FlatList } from 'react-native'
import {useCallback, useEffect, useState} from 'react'
import { Image } from 'expo-image'
import icons from '@/constants/icons'
import { useLocalSearchParams,router, useFocusEffect, Link } from 'expo-router'
import { getOutfitsByCollection } from '@/lib/CRUD/outfitCRUD'
import { useAppwrite } from '@/lib/useAppWrite'
import OutfitCard from '@/components/OutfitCard'
import { Outfit } from '@/constants/outfit'
import { ID } from 'react-native-appwrite';
import CustomHeader from '@/components/CustomHeader'
const OutfitCollection = () => {
  const localParams = useLocalSearchParams<{outfitCollectionId:string,collectionName:string}>()
  const {data:outfits,loading,refetch} = useAppwrite({
    fn: (params) => getOutfitsByCollection(params.id),
    params: {id: localParams.outfitCollectionId}
  })
  const [totalNumberOutfits, setTotalNumberOutfits] = useState(0)
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleAddOutfit = () => {
    const uid = ID.unique();
    router.push({
      pathname: `./outfit/${uid}`,
      params: { 
        outfitName: "New Outfit"
      }
    });
  }
   const handleOutfitPressed = (item:Outfit)=>{
    const id = item.$id || '';
    const outfitName = item.title;
    
    if (isSelectMode) {
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    } else {
      router.push({
        pathname: `./outfit/${id}`,
        params: { 
          outfitName: outfitName
        }
      });
    }
  }
    const handleDeleteSelected = async () => {
      // TODO: Implement delete functionality
      console.log('Deleting items:', selectedItems);
      // Reset selection
      setSelectedItems([]);
      setIsSelectMode(false);
    
    }
     useFocusEffect(
        useCallback(() => {
          refetch();
        },[])
      );
       useEffect(()=>{
    setTotalNumberOutfits(outfits?.length??0)
       },[outfits])
  return (
  <SafeAreaView className='bg-sand-dark flex-1'>
   
    
   <CustomHeader 
    title={localParams.collectionName}
    rightComponent={
      <View className='flex-row justify-end items-end py-2 px-5'>
        
        {isSelectMode ? (
          <TouchableOpacity 
            onPress={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className='' 
          >
            <Image source={icons.deleteIcon} className='size-5' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleAddOutfit} className=''>
            <Image source={icons.plus} className='size-6' />
          </TouchableOpacity>
        )}
      </View>
    } 
  />
   <View className='flex-row justify-between items-center px-5 py-2'>
        <Text className='text-base font-S-Regular'>{totalNumberOutfits} Items</Text>
        {/* Select/Cancel Button */}
        <TouchableOpacity 
          onPress={() => {
            setIsSelectMode(!isSelectMode);
            setSelectedItems([]);
          }}
          className=''
        >
            <Text className='font-S-Regular text-base text-right w-full'>
            {isSelectMode ? 'Cancel' : 'Select'}
            </Text>
        </TouchableOpacity>
      </View>
    {/* fetch Collections Here*/}
    <View className='px-5'>
     
       {loading ? (
              <ActivityIndicator className='text-beige-darker mt-[16rem]' size='large' />
            ) : (
              <FlatList
                data={outfits}
                renderItem={({item}: {item: Outfit}) => (
                  <View key={item.$id} className='w-1/2 px-2'>
                    <OutfitCard item={item} onPress={() => handleOutfitPressed(item)} isSelected={selectedItems.includes(item.$id || '')}
                   isSelectMode={isSelectMode} />
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

export default OutfitCollection