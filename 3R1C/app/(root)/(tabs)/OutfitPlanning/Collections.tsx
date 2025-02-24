import { View, Text,SafeAreaView,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native'
import {useState,useCallback} from 'react'
import icons from '@/constants/icons'
import { Image } from 'expo-image'
import { router,Link,useFocusEffect } from 'expo-router'
import { getOutfitCollections } from '@/lib/CRUD/outfitCRUD'
import { useAppwrite } from '@/lib/useAppWrite'
import OutfitCollectionCard from '@/components/OutfitCollectionCard'
const OutfitCollections = () => {

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

   const handleCollectionPressed = (id:string)=>{
    if (isSelectMode) {
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    } else {
      router.push(`./collection/${id}`);
    }
  }
    const handleDeleteSelected = async () => {
      // TODO: Implement delete functionality
      console.log('Deleting items:', selectedItems);
      // Reset selection
      setSelectedItems([]);
      setIsSelectMode(false);
    
    }
    const {data:collections,loading,refetch} = useAppwrite({fn:getOutfitCollections})
     useFocusEffect(
        useCallback(() => {
          refetch();
        },[])
      );
       
  return (
  <SafeAreaView className='bg-sand-dark flex-1'>
   
    
    <View className='flex-row justify-between items-center py-2 px-5'>
    {/* Select/Cancel Button */}
    <TouchableOpacity 
      onPress={() => {
        setIsSelectMode(!isSelectMode);
        setSelectedItems([]);
      }}
      className='flex-1'
    >
      <Text className='font-S-Regular text-base'>
        {isSelectMode ? 'Cancel' : 'Select'}
      </Text>
    </TouchableOpacity>

    {/* Title */}
    <View className='flex-col flex-1 justify-center items-center'>
      <Text className='font-S-ExtraLightItalic text-2xl'>Your Collections</Text>
      <Image source={icons.headerUnderline} className='w-full h-4' />
    </View>

    {/* Add/Delete Button */}
    <View className='flex-1 justify-end items-end'>
      {isSelectMode ? (
        <TouchableOpacity 
          onPress={handleDeleteSelected}
          disabled={selectedItems.length === 0}
          className='opacity-${selectedItems.length === 0 ? 50 : 100}'
        >
          <Image source={icons.deleteIcon} className='size-8' />
        </TouchableOpacity>
      ) : (
        <Link href="/AddOutfitCollection">
          <Image source={icons.plus} className='size-8' />
        </Link>
      )}
    </View>
  </View>
    {/* fetch Collections Here*/}
    <View className='px-5'>
     
       {loading ? (
              <ActivityIndicator className='text-beige-darker mt-[16rem]' size='large' />
            ) : (
              <FlatList
                data={collections}
                renderItem={({item}: {item: any}) => (
                  <View  className='w-1/2 px-2'>
                    <OutfitCollectionCard key={item.$id}item={item} onPress={() => handleCollectionPressed(item.$id!)} isSelected={selectedItems.includes(item.$id!)}
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

export default OutfitCollections