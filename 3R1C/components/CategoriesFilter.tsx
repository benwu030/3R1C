import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'


export const MainCategoriesFilter = ({Categories}:{Categories:string[]}) => {
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
   <ScrollView horizontal showsHorizontalScrollIndicator={false} className='grow-0 '>
    {Categories.map((category,index)=>(
        <TouchableOpacity key = {index} 
        className={`flex-row items-center mr-4 px-4 py-2 rounded-full ${selectedCategory=== category? 'bg-sand-deep' : ' border border-sand-deep'}`}
         onPress={() => handleCategoryPress(category)}>
      <Text className={`text-sm  ${selectedCategory=== category? 'text-white font-S-Bold ': ' font-S-Regular '}`}>
        {category}
      </Text>
      </TouchableOpacity>))}
    </ScrollView>
  )
}
export const SubCategoriesFilter = ({Categories}:{Categories:string[]}) => {
  const params = useLocalSearchParams<{subCategoryfilter?:string}>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.subCategoryfilter ? params.subCategoryfilter.split(',') : ['All']
  )

  const handleCategoryPress = (category: string) => {
    let newCategories: string[]
    
    if (category === 'All') {
      newCategories = ['All']
    } else if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter(c => c !== category)
      if (newCategories.length === 0) newCategories = ['All']
    } else {
      newCategories = selectedCategories.includes('All') 
        ? [category]
        : [...selectedCategories, category]
    }
    setSelectedCategories(newCategories)
    router.setParams({ subCategoryfilter: newCategories.join(',') })
  }
  return (
   <ScrollView horizontal showsHorizontalScrollIndicator={false} className=' my-2 grow-0 '>
    {Categories.map((category,index)=>(
        <TouchableOpacity key = {index} 
        className={`flex-row flex items-center mr-4 px-4 py-2 rounded-full ${selectedCategories.includes(category)? 'bg-sand-deep' : 'border border-sand-deep'}`}
         onPress={() => handleCategoryPress(category)}>
      <Text className={`text-sm  ${selectedCategories.includes(category)? 'text-white font-S-Bold ': ' font-S-Regular '}`}>
        {category}
      </Text>
      </TouchableOpacity>))}
    </ScrollView>
  )
}
