## About 3R1C

3R1C is a digital cloest app developed using expo and react native. 

It uses Appwrite for database management and Inference Endpoints for hosting API for AI models.

## Main features:

1. Closet Management
2. Expense Tracking
3. Outfit Planning
4. Virtual Try-On
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

### Acknowledgement
3R1C used the below model for virtual try-on.

Gratitude is extended to the IDM-VTON team for developing an exceptional virtual try-on
model and generously open-sourcing its official implementation.

@article{choi2024improving,
  title={Improving Diffusion Models for Authentic Virtual Try-on in the Wild},
  author={Choi, Yisol and Kwak, Sangkyung and Lee, Kyungmin and Choi, Hyungwon and Shin, Jinwoo},
  journal={arXiv preprint arXiv:2403.05139},
  year={2024}
}
