const admin = require('firebase-admin');
const config = require('./config.json');
const key = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(key),
  apiKey: "AIzaSyB63hasxMxZ5OsU31VMQymmgJ5UgqbRxck",
  authDomain: "smarttrap-e9766.firebaseapp.com",
  databaseURL: "https://smarttrap-e9766-default-rtdb.firebaseio.com",
  projectId: "smarttrap-e9766",
  storageBucket: "smarttrap-e9766.appspot.com",
  messagingSenderId: "672006104798",
  appId: "1:672006104798:web:3be2ee2ee043683286044f",
  measurementId: "G-SHCJ7DP5TJ"
});
const db = admin.database()
const firestore = admin.firestore()

const setPin = async(clientID,pinID,state)=>{
    const ref =db.ref("config/"+clientID+'/'+pinID)
    await ref.set({state})  
}
const setVoltage = async(clientID,state)=>{
  const ref =db.ref("config/"+clientID+'/voltage')
  await ref.set({state})  
}
const getVoltage = async(clientID)=>{
  const ref = db.ref("config/"+clientID +'/voltage')
  const data = await ref.get()
  return data.val()
}
const setBrightness = async(clientID,state)=>{
  const ref =db.ref("config/"+clientID+'/brightness')
  await ref.set({state})  
}
const getBrightness = async(clientID)=>{
  const ref = db.ref("config/"+clientID +'/brightness')
  const data = await ref.get()
  return data.val()
}
const setCurrent = async(clientID,state)=>{
  const ref =db.ref("config/"+clientID+'/current')
  await ref.set({state})  
}
const getCurrent = async(clientID)=>{
  const ref = db.ref("config/"+clientID +'/current')
  const data = await ref.get()
  return data.val()
}
const getPin = async (clientID,pinID)=>{
  const ref = db.ref("config/"+clientID+'/'+pinID)
  const data = await ref.get()
  return data.val()
}
const setTimer = async (clientID,timer)=>{
  const ref = db.ref("config/"+clientID +'/timer')
  await ref.set({timer})
}
const setMode = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/mode')
  await ref.set({mode})
}
const getMode = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/mode')
  const data = await ref.get()
  return data.val()
}
let getTimer = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/timer')
  const data = await ref.get()
  return data.val()
}
let setWeather = async (clientID,temp,hum)=>{
  const ref = db.ref("env/"+clientID)
  const archeive = db.ref("env/"+clientID+"/arch")
  const now = new Date();

// Extract only the time portion
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timestamp = `${hours}:${minutes}:${seconds}`
  const date = now.toDateStringString()
  await ref.set({temp,hum,timestamp,date})
  await archeive.push({temp,hum,timestamp,date})
}
let getTempreture = async (clientID)=>{
  const ref = db.ref("env/"+clientID+'/temp')
  const data = await ref.get()
  return data.val()
}
let getHumidity = async (clientID)=>{
  const ref = db.ref("env/"+clientID+'/hum')
  const data = await ref.get()
  return data.val()
}
module.exports = {setMode,getMode,getTempreture,getHumidity,setPin,getPin,setTimer,getTimer,setWeather,setVoltage,getVoltage,setBrightness,getBrightness,setCurrent,getCurrent}
