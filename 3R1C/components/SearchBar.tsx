import { View, Text } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native'
const SearchBar = () => {
    const params = useLocalSearchParams<{query?:string}>()
    const [search,setSearch] = useState(params.query)
    const debouncedSearch = useDebouncedCallback((text:string)=>router.setParams({query:text}),300)
    const handleSearch = (text:string)=>{
        setSearch(text)
        debouncedSearch(text)
    }
  return (
    <View className='flex-row items-center justify-between  px-4 rounded-lg bg-neutral-100 py-2'>
    <View className='flex-1 flex-row items-center justify-start '>
        <TextInput value={search} onChangeText={handleSearch} placeholder='Search for anything' className='text-sm font-S-ExtraLight text-zinc-300 ml-2 flex-1'/>
    </View>

</View>
  )
}

export default SearchBar