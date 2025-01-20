import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import icons from '@/constants/icons'
import { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
const Filters = () => {
    const params = useLocalSearchParams<{category?:string;sortByTime?:string;keywords?:string}>()
    const [isSortByTime, setIsSortByTime] = useState(params.sortByTime === 'true')
    const [isSearch, setIsSearch] = useState(params.keywords)
    const [selectedCategory, setSelectedCategory] = useState(params.category)
    const handleCategoryPressed = ()=>{}
  return (
    <View className='flex-row justify-between items-center px-5 py-2'>
       
        
         <TouchableOpacity className='w-16 justify-center items-end' onPress={()=>setIsSortByTime(prev => !prev)}>
            <Image source = {icons.sortByTime} className='size-6' tintColor={'black'}/>
         </TouchableOpacity>


         <TouchableOpacity className='w-16 justify-center items-end' onPress={()=>setIsSearch(isSearch)}>
             <Image source={icons.search} className='size-8' />
         </TouchableOpacity>
    </View>
  )
}

export default Filters