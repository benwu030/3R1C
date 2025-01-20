import React, { useEffect, useState } from 'react'
import {Modal,View, Text, TextInput, Button, Alert,ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { createClothe, uploadImage } from '@/lib/AppWrite';
import { SetStateAction } from 'react';
import ImagePickerExample from './CustomImagePicker';
import { ImageSource } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { Category } from '@/constants/category';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import CustomImagePicker from './CustomImagePicker';
import MainCategoriesFilter from './MainCategoriesFilter';
import SubCategoriesFilter from './SubCategoriesFilter';
import { useLocalSearchParams } from 'expo-router';
import { ImagePickerAsset } from 'expo-image-picker';
const CreateClothesModal = ({userID }: {userID:string }) => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string;subCategoryfilter?:string}>()
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [remark, setRemark] = useState('');
  const [imageFile, setImageFile] = useState<ImagePickerAsset | null>(null);

  const [colors, setColors] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = async () => {
    if (!imageFile) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    const mainCategoryfilter = params.mainCategoryfilter as Category;
    const subCategoryfilter = params.subCategoryfilter ? 
      (params.subCategoryfilter as string).split(',') as Category[] : 
      [];
    if (!title || !price || !mainCategoryfilter) {
      Alert.alert('Error', 'Please fill all the required fields');
      return;
    }
    const newClothe = {
      userid: userID,
    title,
    price: parseFloat(price),
    remark,
    maincategory:mainCategoryfilter,
    subcategories: subCategoryfilter,
    colors,
    purchasedate: new Date(purchaseDate),
    image: imageFile.uri,
    };
    

    const result = await createClothe(newClothe, userID,imageFile);
    if (result) {
      Alert.alert('Success', 'Clothe created successfully');
      router.back();
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

          <CustomImagePicker imageFile={imageFile} setImageFile={setImageFile}/>
          <Button title="Submit" onPress={handleSubmit} />
          </View>
          </ScrollView>
 

  )
}

export default CreateClothesModal