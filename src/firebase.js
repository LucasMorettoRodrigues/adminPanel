import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwW6TooP3IHRwA4JkRO1MzdKG2uc-dWPc",
  authDomain: "ecommerce-87e77.firebaseapp.com",
  databaseURL: "https://ecommerce-87e77-default-rtdb.firebaseio.com",
  projectId: "ecommerce-87e77",
  storageBucket: "ecommerce-87e77.appspot.com",
  messagingSenderId: "329008221347",
  appId: "1:329008221347:web:ede74c3b8c7bb3adc00316",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
