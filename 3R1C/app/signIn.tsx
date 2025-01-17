import { Image,View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import images from '@/constants/images'
import icons from '@/constants/icons'
import { login } from '@/lib/AppWrite'
import { Redirect, router } from 'expo-router'
import { useGlobalContext } from '@/lib/globalProvider'
const signIn = () => {
  const {refetch, loading, isLoggedIn} = useGlobalContext()
  if(!loading && isLoggedIn) return <Redirect href='/'/>
  const handleLogin = async() =>{
    const result = await login()
    if(result) {
      refetch()
    } else{
      Alert.alert('Error','Failed to login')
    }

  }

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image className="w-full h-4/6 mx-auto" resizeMode ="contain" source = {images.jacket}/>
        <View className='px-10'>
          <Text className='text-4xl text-center uppercase font-S-Regular text-black-200'>3R1C</Text>
          <Text className='text-2xl text-center  font-S-Bold '>A Mobile App to Mitigate Clothing Waste </Text>
          <Text className='text-sm text-center  font-S-Bold text-black-300'>Ben Wu / Supervised by Xu Dong</Text>
          <TouchableOpacity className ='mt-20 bg-white rounded-full w-full shadow-zinc-300 shadow-md py-4 mt-5' onPress={handleLogin}>
            
            <View className="flex-row items-center justify-center">
              <Image source={icons.google} className='w-5 h-5 mr-2' resizeMode='contain'/>
              <Text className='text-lg font-S-Medium text-black-300'>Continue with Google</Text>
            </View>

          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signIn