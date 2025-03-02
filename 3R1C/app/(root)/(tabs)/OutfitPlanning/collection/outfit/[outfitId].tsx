import { View, Text,SafeAreaView,StyleSheet } from 'react-native'
import React, { createContext, useContext,useState } from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import DraggableClothing from '@/components/DraggableClothing'
import images from '@/constants/images'
import { cssInterop } from "nativewind";
import CustomHeader from '@/components/CustomHeader'
import { useLocalSearchParams } from 'expo-router'
cssInterop(GestureHandlerRootView, { className: "style" });


const updateTitle = (title:string)=>{
  console.log(title)
}

const OutfitPlanning = () => {
  const localParams = useLocalSearchParams<{outfitId:string}>()
  return (
    <SafeAreaView className=' flex-1'>

      <CustomHeader title='New Outfit'   
      editableTitle={true}
      onTitleChange={updateTitle}
      />
      <GestureHandlerRootView className='bg-white flex-1'>
        <DraggableClothing imageUri={images.jacket}/>      
        </GestureHandlerRootView>

    </SafeAreaView>
  )
}


export default OutfitPlanning