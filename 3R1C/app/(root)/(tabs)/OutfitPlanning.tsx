import { View, Text,SafeAreaView,StyleSheet } from 'react-native'
import React, { createContext, useContext,useState } from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import DraggableClothing from '@/components/DraggableClothing'
import images from '@/constants/images'
import { cssInterop } from "nativewind";
cssInterop(GestureHandlerRootView, { className: "style" });

interface DraggalbeBoardCOntextProps{
  width:number;
  height:number;
  x:number
  y:number
}

export const DraggableBoardContext = createContext<DraggalbeBoardCOntextProps>({width:0,height:0,x:0,y:0})
export const useDraggableBoardContext = () => useContext(DraggableBoardContext)
const OutfitPlanning = () => {
  const [boardLayout, setBoardLayout] = useState({width:0,height:0,x:0,y:0})
  return (
    <SafeAreaView className=' flex-1'>
      {/* <DraggableBoardContext.Provider value={boardLayout} > */}
      <GestureHandlerRootView className='bg-white flex-1' onLayout={(event) => {setBoardLayout(event.nativeEvent.layout)}}>
        <DraggableClothing imageUri={images.jacket}/>      
        </GestureHandlerRootView>
        {/* </DraggableBoardContext.Provider> */}

    </SafeAreaView>
  )
}


export default OutfitPlanning