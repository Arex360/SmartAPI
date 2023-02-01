const { firestore } = require('firebase-admin');
const admin = require('firebase-admin');
const config = require('./config.json');
const key = require('./key.json')
const {words} = require('./dataset.json')
admin.initializeApp({
  "apiKey": "AIzaSyDdoZNCdUJLilodWTDFFT9Qwe-lxeC92ek",
  credential: admin.credential.cert(key),
  "authDomain": "wordpuzzle-69640.firebaseapp.com",
  "databaseURL": "https://wordpuzzle-69640-default-rtdb.firebaseio.com",
  "projectId": "wordpuzzle-69640",
  "storageBucket": "wordpuzzle-69640.appspot.com",
  "messagingSenderId": "1058291786842",
  "appId": "1:1058291786842:web:80c4eab8ac40a2da8ee463",
  "measurementId": "G-TMFG368WQ5"
});

const db = admin.firestore()
for(let i=0;i<words.length;i++){
    console.log(i)
    db.collection("Tasks").doc("month").collection("January").doc(`"${i+1}`).set({word:words[i],Date:`January ${i+1} 2023`,index:i})
}

