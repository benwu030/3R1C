import React from 'react'
import CreateClothesModal from '@/components/CreateClothesModal';
import { useGlobalContext } from '@/lib/globalProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function AddClothes() {
  const {user}=useGlobalContext()
  return (
      <GestureHandlerRootView className='bg-sand-white flex-auto'>
    <CreateClothesModal userID={user?.$id??''}/>
    </GestureHandlerRootView>
  );
}

