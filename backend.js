const admin = require('firebase-admin');
const config = require('./config.json');
const key = require('./key.json')
const crypto = require('crypto');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const _months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
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
const setBoxState = async(clientID,state)=>{
  const ref = db.ref("config/"+clientID+'/boxState')
  await ref.set(state)
}
const getBoxState = async (clientID)=>{
  const ref = db.ref("config/"+clientID+'/boxState')
  const data = await ref.get()
  return data.val()
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
  const now = new Date();

// Extract only the time portion
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timestamp = `${hours}:${minutes}:${seconds}`
  const date = now.toDateString()
  await ref.set({temp,hum,timestamp,date})
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(timestamp);
  const hexHash = md5Hash.digest('hex');
  const archeive = db.ref("history/"+hexHash)
  await archeive.set({temp,hum,timestamp,date,clientID})
  const month = _months[now.getMonth()];
  if (!fs.existsSync(month)) {
    fs.mkdirSync(month);
    console.log(`Folder ${month} created successfully`);
  } else {
    console.log(`Folder ${month} already exists`);
  }
  if (!fs.existsSync(month+'/'+clientID.toString())) {
    fs.mkdirSync((month+'/'+clientID.toString()));
    console.log(`Folder ${month} created successfully`);
  } else {
    console.log(`Folder ${month} already exists`);
  }
  const filename = now.getDate()+".json"
  const data = {temp,hum}
  fs.writeFileSync(`${month}/${clientID}/${filename}`, JSON.stringify(data));

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
const getWeather = async (clientID) => {
  const now = new Date();
  const month = _months[now.getMonth()];
  const data = [];

  try {
    for (let day = 1; day <= now.getDate(); day++) {
      const filename = day + ".json";
      const filePath = `${month}/${clientID}/${filename}`;

      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        const parsedData = JSON.parse(jsonData);

        // Construct date object from filename
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        let dateString = date.toString()
        dateString = dateString.substring(8,10)
        // Check if date is within range
        if (date >= getStartDate() && date <= now) {
          data.push({ temp: parsedData.temp, hum: parsedData.hum, date:dateString });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  fs.writeFileSync(`${clientID}.json`,JSON.stringify(data))
  execSync(`python3 chart.py ${clientID}.json`)
  return data;
};

// Helper function to get the start date of the current month
const getStartDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

module.exports = {getWeather,setBoxState,getBoxState,setMode,getMode,getTempreture,getHumidity,setPin,getPin,setTimer,getTimer,setWeather,setVoltage,getVoltage,setBrightness,getBrightness,setCurrent,getCurrent}
