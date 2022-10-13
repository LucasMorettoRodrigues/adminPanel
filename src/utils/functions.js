import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuid } from "uuid";

// Receives a storage images URL list and delete from storage
export const deleteImagesFromStorage = async (images) => {
  for (let imageURL of images) {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
  }
};

// Upload local image to storage and return list of URLs
export const uploadImageToStorage = async (localImages) => {
  const imagesURL = [];

  for (let localImage of localImages) {
    const storageRef = ref(storage, `products/${uuid()}`);
    let response = await uploadBytesResumable(storageRef, localImage.file);
    const imageURL = await getDownloadURL(response.ref);
    imagesURL.push(imageURL);
  }

  return imagesURL;
};
