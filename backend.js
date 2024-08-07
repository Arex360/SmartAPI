const admin = require('firebase-admin');
const config = require('./config.json');
const key = require('./key.json')
const crypto = require('crypto');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const { time } = require('console');
const _months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const axios = require('axios');
const readJsonFiles = require('./model');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "129.151.145.229",
  user: "arex",
  password: "123",
  database:"smart"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
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
const requestDeletion = async(email)=>{
  const ref = db.ref("deletion/")
  await ref.set({email})
}
const setQuality = async(clientID,quality)=>{
  const ref =db.ref("config/"+clientID+'/quality')
  await ref.set({quality})  
}
const setVoltage = async(clientID,state)=>{
  const ref =db.ref("config/"+clientID+'/voltage')
  await ref.set({state})  
}
const getVoltage = async(clientID,state)=>{
  const ref =db.ref("config/"+clientID+'/voltage')
  const data = await ref.get()
  return data.val() 
}
const getQuality = async(clientID)=>{
  const ref = db.ref("config/"+clientID+'/quality')
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
  let date = now.toDateString()
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,hour24:false };
  date =  now.toLocaleString('en-US', options);
  console.log(date)
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
let setCount = async (clientID,count)=>{
  const ref = db.ref("env/"+clientID)
  const now = new Date();

// Extract only the time portion
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timestamp = `${hours}:${minutes}:${seconds}`
  const date = now.toDateString()
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
  const filename = "c"+now.getDate()+".json"
  const data = {count}
  let parsedJson = {}
  let _count = 0
  if(fs.existsSync(`${month}/${clientID}/${filename}`)){
    const jsonData = fs.readFileSync(`${month}/${clientID}/${filename}`)
    parsedJson = JSON.parse(jsonData)
    _count = parsedJson.count
  }
  if(count > _count)
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
  const cData = []
  try {
    for (let day = 1; day <= now.getDate(); day++) {
      const filename = day + ".json";
      const cFileName = "c"+day+".json"
      const filePath = `${month}/${clientID}/${filename}`;
      const cFilePath =  `${month}/${clientID}/${cFileName}`
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
      if (fs.existsSync(cFilePath)) {
        const jsonData = fs.readFileSync(cFilePath);
        const parsedData = JSON.parse(jsonData);

        // Construct date object from filename
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        let dateString = date.toString()
        dateString = dateString.substring(8,10)
        // Check if date is within range
        if (date >= getStartDate() && date <= now) {
          cData.push({ count: parsedData.count, date:dateString });
        }
      }


    }
  } catch (error) {
    console.error(error);
  }
  fs.writeFileSync(`${clientID}.json`,JSON.stringify(data))
  fs.writeFileSync(`c${clientID}.json`,JSON.stringify(cData))
  console.log(JSON.stringify(data))
  execSync(`python3 chart.py ${clientID}.json c${clientID}.json`)
  return data;
};

// Helper function to get the start date of the current month
const getStartDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};
const GetCSV = (clientName,Month,res)=>{
  console.log( `Command: python CSVReport.py ${Month/clientName}`)
  
}
const setBattery = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/battery')
  await ref.set({mode})
}

const setTemp = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/temprature')
  await ref.set({mode})
}
const setHum = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/humidity')
  await ref.set({mode})
}
const set_timer = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/timer')
  await ref.set({mode})
}
const set_brightness = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/brightness')
  await ref.set({mode})
}
const set_chunk = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/chunk')
  await ref.set({mode})
}
const setServo = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/servo')
  await ref.set({mode})
}
const setDebug = async (clientID,mode)=>{
  const ref = db.ref("config/"+clientID +'/debug')
  //if(mode == "true"){
    //await set_timer(clientID,"1")
  //}
  await ref.set({mode})
}

const getBattery = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/battery')
  const data = await ref.get()
  const {mode} = data.val()
  return mode
}
const getDebug = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/debug')
  const data = await ref.get()
  const {mode} = data.val()
  if(mode == null || mode == undefined){
    return "false"
  }else
    return mode
}
const getServo = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/servo')
  const data = await ref.get()
  const {mode} = data.val()
  return mode
}
const getTemp = async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/temprature')
  const data = await ref.get()
  const {mode} = data.val()
  return mode
}
const getHum= async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/humidity')
  const data = await ref.get()
  const {mode} = data.val()
  return mode
}
const get_Timer= async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/timer')
  const data = await ref.get()
  const {mode} = data.val()
  let out = ""
  if(mode == null){
    out = data.val()['timer']
  }else{
    out = mode
  }
  return out
}
const get_brightness= async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/brightness')
  const data = await ref.get()
  const {mode,state} = data.val()
  if(mode != undefined)
    return mode
  else 
    return state
}
const get_chunk= async (clientID)=>{
  const ref = db.ref("config/"+clientID +'/chunk')
  const data = await ref.get()
  const {mode,state} = data.val()
  if(mode != undefined)
    return mode
  else 
    return state
}
const GetEnvChart = ({clientID})=>{
  const now = new Date()
  const month = _months[now.getMonth()]
  const details = readJsonFiles(`${month}/${clientID}`)
  return details
}
const setALLData = async ({ServoStatus,temprature,humidity,battery,timer},clientID)=>{
   const r = await axios.get(`http://mnsstrap.ddns.net:3001/setenv/${clientID}/${temprature}/${humidity}`)
   await setBattery(clientID,battery)
   await setServo(clientID,ServoStatus)
   await setTemp(clientID,temprature)
   await setHum(clientID,humidity)
   let temp = temprature
   let hum = humidity
   //await set_timer(clientID,timer)
   const now = new Date();
   const _timestamp = Date.now();
   console.log(_timestamp)
   const insertBatteryQuery = `INSERT INTO battery (value, time, client,temp,hum) VALUES (${battery}, ${_timestamp}, "${clientID}",${Math.floor(temprature)},${Math.floor(humidity)})`;
   con.query(insertBatteryQuery,(err, result)=>{
    if(err){
      console.log(err)
    }else{
      console.log("inserted");
    }
   })
   // Extract only the time portion
     const hours = now.getHours().toString().padStart(2, '0');
     const minutes = now.getMinutes().toString().padStart(2, '0');
     const seconds = now.getSeconds().toString().padStart(2, '0');
     const timestamp = `${hours}:${minutes}:${seconds}`
     const date = now.toDateString()
    // await ref.set({temp,hum,timestamp,date})
     const md5Hash = crypto.createHash('md5');
     md5Hash.update(timestamp);
     const hexHash = md5Hash.digest('hex');
     const archeive = db.ref("history/"+hexHash)
     //await archeive.set({temp,hum,timestamp,date,clientID})
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
setALLData({ServoStatus:1,temprature:1,humidity:1,battery:1,timer:1},'client1')
const setOnlyTimer = async({timer},clientID)=>{
  await set_timer(clientID,timer)
}
const getOnlyTimer = async (clientID) =>{
  let timer = await get_Timer(clientID)
  return timer.toString()
}
const setAllDataV2 = async({timer,brightness},clientID)=>{
 // await set_timer(clientID,timer)
  await set_brightness(clientID,brightness)
}
const getAllDatav2 = async (clientID)=>{
  let timer = await getOnlyTimer(clientID)
  let brightness = await get_brightness(clientID)
  let chunk = await get_chunk(clientID)
  let devMode = await getDebug(clientID)
  timer = timer.toString();
  return ({timer,brightness,chunk,devMode,res:'SVGA'})
}

const getAllData = async(clientID)=>{
  let servo = await getServo(clientID)
  let battery = await getBattery(clientID)
  let temp = await getTemp(clientID)
  let hum = await getHum(clientID)
  let timer = await getOnlyTimer(clientID)
  let devMode = await getDebug(clientID)
  timer = timer.toString();
  return {servo,battery,temp,hum,timer,devMode,res:'SVGA'}
}
function timeAgo(timestamp) {
  const currentDate = new Date();
  const providedDate = new Date(timestamp * 1000); // Convert seconds to milliseconds

  const timeDifference = currentDate - providedDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return seconds + ' seconds ago';
  } else if (minutes < 60) {
    return minutes + ' minutes ago';
  } else if (hours < 24) {
    return hours + ' hours ago';
  } else {
    return days + ' days ago';
  }
}
const getLastImageTime = async({clientID})=>{
  let res = await axios.get(`http://mnsstrap.ddns.net:5000/Getdetection/${clientID}/date`)
  res = res.data 
  console.log(res)
  return timeAgo(res)
  
}

const getUserAccounts = async()=>{
  const data = await firestore.collection("users")
  let snapshot = await data.get()
  snapshot = snapshot.docs 
  let users = []
  snapshot.forEach(shot=>{
     users.push(shot.data())
  })
  return users
}
const getTraps = async({id})=>{
  const data = db.ref("accounts/"+id)
  let snapshot = await data.get()
  console.log(snapshot.val())
  return snapshot.val()
}
module.exports = {requestDeletion,setQuality,getQuality,getTraps,getUserAccounts,getLastImageTime,GetEnvChart,setDebug,getDebug,set_chunk,setOnlyTimer,getOnlyTimer,get_brightness,set_brightness,setServo,getBattery,setBrightness,setAllDataV2,getAllDatav2,getAllData,setALLData,setBattery,setServo,getBattery,getServo,GetCSV,setCount,getWeather,setBoxState,getBoxState,setMode,getMode,getTempreture,getHumidity,setPin,getPin,setTimer,getTimer,setWeather,setVoltage,getVoltage,setBrightness,getBrightness,setCurrent,getCurrent}
