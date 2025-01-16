import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'
import { CATEGORIES } from '@/constants/data'
const CategoriesFilter = () => {
  const params = useLocalSearchParams<{filter?:string}>()
  const [selectedCategory,setSelectedCategory] = useState(params.filter || "All")
  const handleCategoryPress = (category:string)=>{
      if (selectedCategory === category){
        setSelectedCategory('All')
        router.setParams({filter:'All'})
        return
      }
      setSelectedCategory(category)
      router.setParams({filter:category})
  }
  return (
   <ScrollView horizontal showsHorizontalScrollIndicator={false} className=' my-2'>
    {CATEGORIES.map((category,index)=>(
        <TouchableOpacity key = {index} 
        className={`flex-row flex items-center mr-4 px-4 py-2 rounded-full ${selectedCategory === category? 'bg-sand-deep' : 'bg-primary-100 border border-primary-200'}`}
         onPress={() => handleCategoryPress(category)}>
      <Text className={`text-sm  ${selectedCategory === category ? 'text-white font-S-Bold ': ' font-S-Regular '}`}>
        {category}
      </Text>
      </TouchableOpacity>))}
    </ScrollView>
  )
}

export default CategoriesFilter