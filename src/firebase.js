import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA-6MDECpT5inFkk5cHTZqTy1BoRNY0CXw",
    authDomain: "spaces-a823f.firebaseapp.com",
    projectId: "spaces-a823f",
    storageBucket: "spaces-a823f.appspot.com",
    messagingSenderId: "888060089855",
    appId: "1:888060089855:web:2ed9bc78ed74d5ed4b83ca",
    measurementId: "G-W6FX4T4PDG"
  };

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}
export default firebase;
