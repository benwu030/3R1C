## Get started

1. Install dependencies

   ```bash
   cd 3R1C
   npm install
   ```

2. create a .env.local with following keys
   ```
   EXPO_PUBLIC_APPWRITE_ID =
   EXPO_PUBLIC_APPWRITE_PLATFORM =
   EXPO_PUBLIC_APPWRITE_ENDPOIINT =
   EXPO_PUBLIC_APPWRITE_DATABASE_ID =
   EXPO_PUBLIC_APPWRITE_CLOTHES_COLLECTION_ID =
   EXPO_PUBLIC_APPWRITE_CLOTHES_STORAGE_ID =
   EXPO_PUBLIC_APPWRITE_OUTFIT_STORAGE_ID =
   EXPO_PUBLIC_APPWRITE_OUTFIT_COLLECTION_ID =
   EXPO_PUBLIC_APPWRITE_OUTFITCOLLECTION_COLLECTION_ID =
   EXPO_PUBLIC_APPWRITE_OUTFITCOLLECTION_RELATIONSHIP_COLLECTION_ID =
   EXPO_PUBLIC_APPWRITE_PREVIEW_STORAGE_ID =
   EXPO_PUBLIC_APPWRITE_SPENDINGLIMIT_COLLECTION_ID =
   EXPO_PUBLIC_HUGGINGFACE_API_KEY =
   EXPO_PUBLIC_IDMVTON_ENDPOINT =
   EXPO_PUBLIC_YOLO_ENDPOINT =
   ```
3. Start the app

   ```bash
    npx expo start
   ```

## Build with Xcode

1.  Create a prebuild

    ```bash
    npx expo prebuild --platform ios --clean
    ```

2.  Open the created ios folder with Xcode and run build.

## Related Repo

1. YOLO Training Notebook - https://github.com/benwu030/3R1C-Yolo
2. IDM-VTON Hugging Face Model - https://huggingface.co/benwu030/3R1C
3. YOLO11 Hugging Face Model - https://huggingface.co/benwu030/yolov11-seg
