import React, { useEffect, useState } from 'react'
import {View, Text, TextInput, Button, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { createClothe } from '@/lib/AppWrite';
import { Category } from '@/constants/category';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router,useLocalSearchParams} from 'expo-router';
import CustomImagePicker from './CustomImagePicker';
import {MainCategoriesFilter,SubCategoriesFilter} from './CategoriesFilter';
import { CATEGORIES } from '@/constants/data'
import { ImagePickerAsset } from 'expo-image-picker';
import CircularHue from './CircularHue';
const CreateClothesModal = ({userID }: {userID:string }) => {
  const params = useLocalSearchParams<{mainCategoryfilter?:string;subCategoryfilter?:string}>()
  const categories = CATEGORIES.filter((category) => category !== 'All');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [remark, setRemark] = useState('');
  const [imageFile, setImageFile] = useState<ImagePickerAsset | null>(null);

  const [color, setColor] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = async () => {
    if (!imageFile) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    const mainCategoryfilter = params.mainCategoryfilter as Category;
    const subCategoryfilter = params.subCategoryfilter ? 
      (params.subCategoryfilter).split(',') as Category[] : 
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
    colors:color,
    purchasedate: purchaseDate,
    image: imageFile.uri,
    };
    

    const result = await createClothe(newClothe, userID,imageFile);
    if (result) {
      Alert.alert('Success', 'Clothe created successfully');
      router.back();
    } else {
      Alert.alert('Error', 'Failed to create clothe');
      router.back();

    }
  };
  useEffect(() => {
    console.log('mainCate:',params.mainCategoryfilter);
    console.log('subCate:',params.subCategoryfilter);
  }, [params.mainCategoryfilter,params.subCategoryfilter]);
  // console.log('userID',userID)

  return (
    
        <ScrollView contentContainerClassName='pb-32 bg-white' showsHorizontalScrollIndicator={true} >
        <View className="p-5 flex-col">
          
        <CustomImagePicker imageFile={imageFile} setImageFile={setImageFile}/>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
          />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
           
          />
          <TextInput
            placeholder="Remark"
            value={remark}
            onChangeText={setRemark}
            className="font-S-RegularItalic border-b border-gray-300 mb-4 text-2xl py-2"
            multiline={true}
            numberOfLines={4}
          />
          <Text className="font-S-RegularItalic text-lg mb-1">Main Category</Text>
          <MainCategoriesFilter Categories={categories} />
          <Text className="font-S-RegularItalic text-lg my-2">Sub Categories</Text>
          <SubCategoriesFilter Categories={categories}/>
         
      
            <View className='flex-col flex-1'> 
              <Text className="font-S-RegularItalic text-lg mb-1">Select a Color</Text> 
              <CircularHue setColor={setColor}/>
            </View>
           
            <View className="flex-col items-begin">
            <Text className="font-S-RegularItalic text-lg mb-1">Select Purchase Date</Text>
            <View className="ml-[-8]">
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
              setShowDatePicker(!showDatePicker);
              if (selectedDate) {
                setPurchaseDate(selectedDate);
              } 
         
              }}
            />
            </View>
          </View>
         
        

          <Button title="Submit" onPress={handleSubmit} />
          </View>
          </ScrollView>
 

  )
}

export default CreateClothesModal