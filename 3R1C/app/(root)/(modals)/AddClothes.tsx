import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Link,router} from 'expo-router'
import { StyleSheet, Text, View } from 'react-native';
import CreateClothesModal from '@/components/CreateClothesModal';
import { useGlobalContext } from '@/lib/globalProvider';
export default function AddClothes() {
  const {user}=useGlobalContext()
  return (
      <View className='bg-sand-white flex-auto'>
    <CreateClothesModal userID={user?.$id||''}/>
    </View>
  );
}

