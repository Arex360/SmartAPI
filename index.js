const {getAllData,setALLData,getBattery,getServo,setBattery,setServo,GetCSV,getMode,setMode,getHumidity,getTempreture,getPin,setPin,getTimer,setTimer,setWeather,getBrightness,getCurrent,getVoltage,setBrightness,setCurrent,setVoltage, setBoxState, getBoxState, getWeather, setCount}= require('./backend')
const express = require('express')
const crypto = require('crypto')
const bodyparser = require('body-parser')
const cors = require('cors')
const { firestore } = require('firebase-admin')
const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')
const app = express()
app.use(cors())
app.use(bodyparser())
const date = new Date()
//console.log(date.getDate())
app.get('/',(req,res)=>res.send('welcome'))
app.get('/DownloadCSV/:month/:client',(req,res)=>{
  const {client,month} =req.params
  console.log(`${client} is power`)
  execSync(`python3 CSVReport.py ${month}/${client}`)
  const csvFilePath = path.join(__dirname, 'merged_data.csv');
  // Check if the file exists
  if (fs.existsSync(csvFilePath)) {
    // Set response headers to specify the file type and attachment
    res.setHeader('Content-Disposition', 'attachment; filename="sample.csv"');
    res.setHeader('Content-Type', 'text/csv');

    // Create a read stream to send the file
    const fileStream = fs.createReadStream(csvFilePath);

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 response
    res.status(404).send('File not found');
  }
})

app.post('/setAllData/:clientID',async (req,res)=>{
   const {clientID} = req.params
   const {battery,humidity,temprature,ServoStatus,timer} = req.body
   await setALLData({battery,humidity,temprature,ServoStatus},clientID)
   res.send("Data saved");
})
app.get('/getAllData/:clientID',async(req,res)=>{
  const {clientID} = req.params
  const data = await getAllData(clientID)
  res.send(data)
})

app.get('/setPinState/:clientID/:pinId/:state',async (req,res)=>{
  const {clientID,pinId,state} = req.params
  await setPin(clientID,pinId,state)
  res.send('done')
})
app.get('/setCurrent/:clientID/:state',async (req,res)=>{
  const {clientID,state} = req.params
  await setCurrent(clientID,state)
  res.send('done')
})
app.get('/setMode/:clientID/:value',async (req,res)=>{
  const {clientID,value} = req.params
  await setMode(clientID,value)
  res.send("done")
})
app.get('/setBoxState/:clientID/:state',async(req,res)=>{
  const {clientID,state} = req.params
  await setBoxState(clientID,state)
  res.send("updated")
})
app.get('/getBoxState/:clientID',async (req,res)=>{
  const {clientID} = req.params
  const result = await getBoxState(clientID)
  res.send(result)
})
app.get('/getMode/:clientID',async(req,res)=>{
  const {clientID} = req.params
  const data = await getMode(clientID)
  if(data){
    res.send(data.mode)
  }else{
    res.send(0)
  }
})
app.get('/setBrightness/:clientID/:state',async (req,res)=>{
  const {clientID,state} = req.params
  await setBrightness(clientID,state)
  res.send('done')
})
app.get('/setVoltage/:clientID/:state',async (req,res)=>{
  const {clientID,state} = req.params
  await setVoltage(clientID,state)
  res.send('done')
})
app.get('/getPinState/:clientID/:pinId',async (req,res)=>{
  const {clientID,pinId} = req.params
  const data = await getPin(clientID,pinId)
  if(data != null)
    res.send(data.state)
  else
  res.send("0")
})
app.get('/getVoltage/:clientID',async (req,res)=>{
  const {clientID} = req.params
  const data = await getVoltage(clientID)
  if(data != null)
    res.send(data.state)
  else
  res.send("0")
})
app.get('/getCurrent/:clientID',async (req,res)=>{
  const {clientID} = req.params
  const data = await getCurrent(clientID)
  if(data != null)
    res.send(data.state)
  else
  res.send("0")
})
app.get('/getBrightness/:clientID',async (req,res)=>{
  const {clientID} = req.params
  const data = await getBrightness(clientID)
  if(data != null)
    res.send(data.state)
  else
  res.send("0")
})
app.get('/setTimer/:clientID/:timer', async (req,res)=>{
  const {clientID,timer} = req.params
  const data = await setTimer(clientID,timer)
  res.send("updated")
})
app.get('/getTimer/:clientID',async (req,res)=>{
   const {clientID} = req.params
   const data = await getTimer(clientID)
   if(data)
    res.send(data.timer)
   else
    res.send(3000)
})

app.get("/setEnv/:clientID/:temp/:hum",async (req,res)=>{
  const {hum,temp,clientID} = req.params
  await setWeather(clientID,hum,temp)
  res.send("done")
})
app.get('/getWeather/:clientID',async (req,res)=>{
  const {clientID} = req.params 
  const data = await getWeather(clientID)
  //res.send(data)
  res.sendFile(__dirname+'/'+clientID+".json.png")
})
app.get("/getTempreture/:clientID",async (req,res)=>{
  const {clientID} = req.params
  const data = await getTempreture(clientID)
  if(data){
    res.send(data)
  }else{
    res.send(0)
  }
})
app.get("/getHumidity/:clientID",async (req,res)=>{
  const {clientID} = req.params
  const data = await getHumidity(clientID)
  if(data){
    res.send(data)
  }else{
    res.send(0)
  }
})
app.get('/setCount/:clientID/:count', async (req,res)=>{
  const {clientID,count} = req.params
  const data = await setCount(clientID,count)
  res.send("done") 
})
app.post('/log/:clientID',(req,res)=>{
  const {clientID} = req.params
  const {msg} = req.body
  fs.appendFileSync(`${clientID}.txt`,new Date().toString()+ msg+"\n")

  res.status(200).send('Log stored successfully')
})
app.get('/checkLog/:clientID',(req,res)=>{
  const {clientID} = req.params
  res.sendFile(__dirname+'/'+clientID+".txt")
})
app.get('/getBattery/:clientID', async (req,res)=>{
  const {clientID} = req.params
  const {mode} = await getBattery(clientID)
  res.send(mode)
})
app.get('/getServo/:clientid', async (req,res)=>{
  const {clientid} = req.params
  const {mode} = await getServo(clientid)
  res.send(mode)
})
app.get('/setBattery/:clientID/:ammount',async (req,res)=>{
  const {ammount,clientID} = req.params
  const result = await setBattery(clientID,ammount)
  res.send("done")
})
app.get('/setServo/:clientid/:mode',async (req,res)=>{
  console.log("servo")
  const {clientid,mode} = req.params
  const result = await setServo(clientid,mode)
  res.send("done")
})
app.listen(3001,()=>{
  console.log('server started')
})