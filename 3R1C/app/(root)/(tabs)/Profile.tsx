import { View, Text, ScrollView, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import { Image } from 'expo-image'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { useGlobalContext } from '@/lib/globalProvider'
import { logout } from '@/lib/AppWrite'

interface settingItemsProps{
    icon:ImageSourcePropType,
    title:string,
    onPress?:()=>void,
    textStyle?:string,
    showArrow?:boolean
}

const SettingItems = ({icon,title,onPress,textStyle,showArrow = true}:settingItemsProps)=>(
    <TouchableOpacity onPress = {onPress} className='flex-row items-center justify-between py-3 '>
        <View className='flex-row items-center gap-3'>
            <Image source = {icon} className='size-6'/>
            <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
        </View>
        {showArrow && <Image source={icons.rightArrow} className='size-5'/>}
    </TouchableOpacity>
)
const Profile = () => {
    const handleLogout = async () =>{
        const result = await logout()
        if(result){
            Alert.alert('logout succesfully')
            refetch()
        }
        else{
            Alert.alert('Logout failed')
        }
    }
    const {user,refetch} = useGlobalContext()
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView showsVerticalScrollIndicator = {false} contentContainerClassName='pb-32 px-7'>
    {/* header */}
        <View className='flex-row items-center justify-between mt-5'>
            <Text className='text-xl font-rubik-bold'>Profile</Text>
            {/* <Image source = {icons.bell} className='size-5'/> */}
        </View>
    {/* avatar */}

        <View className='flex-row justify-center mt-5'>
            <View className='flex-col relative mt-5 items-center'>
                <Image source = { {uri: user?.avatar}} className='size-44 relative rounded-full'/>
                <TouchableOpacity className='absolute bottom-11 right-2'>

                {/* <Image source = {icons.edit} className='size-9'/> */}
                </TouchableOpacity>
                <Text className='text-2xl font-rubik-bold mt-2'>{user?.name}</Text>
            </View>
        </View>

        {/* profile list buttons */}
        <View className=' flex-col mt-10'>
            {/* <SettingItems icon={icons.calendar} title="My bookings" />
            <SettingItems icon={icons.wallet} title="My Payments" /> */}
        </View>

        {/* <View className=' flex-col mt-5 border-t pt-5 border-primary-200'>
            {settings.slice(2).map((item,index)=>(
                <SettingItems key={index} {...item}/>
            ))
        }
        </View>  */}
        <View className=' flex-col mt-5 border-t pt-5 border-primary-200'>
        <SettingItems icon={icons.logout} title="Logout" textStyle='text-danger' showArrow={false} onPress={handleLogout}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile