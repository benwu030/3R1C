import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'
import { CATEGORIES } from '@/constants/data'
const MainCategoriesFilter = () => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string}>()
  const [selectedCategory, setSelectedCategory] = useState<string>(
    params.mainCategoryfilter ? params.mainCategoryfilter : 'All'
  )

  const handleCategoryPress = (category: string) => {
    
    if(selectedCategory ==category){//reset
      setSelectedCategory('All')
      router.setParams({ filter: 'All' })
    }
    else{
      setSelectedCategory(category)
      router.setParams({ mainCategoryfilter: category })
    }
    
  }
  return (
   <ScrollView horizontal showsHorizontalScrollIndicator={false} className=' my-2'>
    {CATEGORIES.map((category,index)=>(
        <TouchableOpacity key = {index} 
        className={`flex-row flex items-center mr-4 px-4 py-2 rounded-full ${selectedCategory=== category? 'bg-sand-deep' : ' border border-sand-deep'}`}
         onPress={() => handleCategoryPress(category)}>
      <Text className={`text-sm  ${selectedCategory=== category? 'text-white font-S-Bold ': ' font-S-Regular '}`}>
        {category}
      </Text>
      </TouchableOpacity>))}
    </ScrollView>
  )
}

export default MainCategoriesFilter