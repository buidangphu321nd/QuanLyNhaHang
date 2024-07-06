// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import  {getFirestore} from 'firebase/firestore'
import {getDatabase,ref,set,get,remove,push,update} from 'firebase/database'
import {getStorage} from 'firebase/storage'
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcnPmc9hKBIU_GwI_dDHPFWMxODnNTl-A",
  authDomain: "restaurantmanager-c2bab.firebaseapp.com",
  databaseURL: "https://restaurantmanager-c2bab-default-rtdb.firebaseio.com",
  projectId: "restaurantmanager-c2bab",
  storageBucket: "restaurantmanager-c2bab.appspot.com",
  messagingSenderId: "1018434059500",
  appId: "1:1018434059500:web:5a8c3ef1f17469efc079c9",
  measurementId: "G-DK6D4EJS79"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const DATABASE = getDatabase(FIREBASE_APP);
const STORAGE = getStorage(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);
export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB, DATABASE, STORAGE, analytics, ref, set,get,remove,push,update };
