import React, { useEffect, useState } from 'react'
import {Modal,View, Text, TextInput, Button, Alert,ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { createClothe } from '@/lib/AppWrite';
import { SetStateAction } from 'react';
import ImagePickerExample from './ImagePicker';
import { ImageSource } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { Category } from '@/constants/category';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from 'expo-router';
import CustomImagePicker from './ImagePicker';
import MainCategoriesFilter from './MainCategoriesFilter';
import SubCategoriesFilter from './SubCategoriesFilter';
import { useLocalSearchParams } from 'expo-router';
const CreateClothesModal = ({userID }: {userID:string }) => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string;subCategoryfilter?:string}>()
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [remark, setRemark] = useState('');
  const [mainCategory, setMainCategory] = useState<Category>(Category.JACKET);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = async () => {
    const newClothe = {
      $id: 'unique()', // This will be auto-generated
    title,
    price: parseFloat(price),
    remark,
    mainCategory,
    subCategories: subCategories,
    colors,
    purchaseDate: new Date(purchaseDate),
    createdAt: new Date(),
    image: '' as ImageSource, // Initialize as empty array of ImageSourceType
    };
    
    const result = await createClothe(newClothe,userID);
    if (result) {
      Alert.alert('Success', 'Clothe created successfully');
    } else {
      Alert.alert('Error', 'Failed to create clothe');
    }
  };
  useEffect(() => {
    console.log('mainCate:',params.mainCategoryfilter);
    console.log('subCate:',params.subCategoryfilter);
  }, [params.mainCategoryfilter,params.subCategoryfilter]);
  // console.log('userID',userID)

  return (
    
        <ScrollView contentContainerClassName='pb-32' showsHorizontalScrollIndicator={true} >
        <View className="p-5 flex-col h-[80rem]">
         <Text className="text-xl font-bold mb-4">Create New Clothe</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            className="border-b border-gray-300 mb-4"
          />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            className="border-b border-gray-300 mb-4"
          />
          <TextInput
            placeholder="Remark"
            value={remark}
            onChangeText={setRemark}
            className="border-b border-gray-300 mb-4"
          />
          <MainCategoriesFilter/>
          <SubCategoriesFilter/>
         
          <TextInput
            placeholder="Colors"
            value={colors}
            onChangeText={setColors}
            className="border-b border-gray-300 mb-4"
          />
          <View className="border-b border-gray-300 mb-4">
            <Text onPress={() => setShowDatePicker(true)}>
              {purchaseDate ? purchaseDate : 'Select Purchase Date'}
            </Text>
            {showDatePicker && (
              <DateTimePicker
            value={purchaseDate ? new Date(purchaseDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setPurchaseDate(selectedDate.toISOString().split('T')[0]);
              }
            }}
              />
            )}
          </View>

          <CustomImagePicker/>
          <Button title="Submit" onPress={handleSubmit} />
          </View>
          </ScrollView>
 

  )
}

export default CreateClothesModal