import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import icons from '@/constants/icons'

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <Image source={icons.closet} className='w-20 h-20' />
      
    </View>
  )
}

export default index