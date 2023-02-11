const {getHumidity,getTempreture,getPin,setPin,getTimer,setTimer,setWeather,getBrightness,getCurrent,getVoltage,setBrightness,setCurrent,setVoltage}= require('./backend')
const express = require('express')
const crypto = require('crypto')
const bodyparser = require('body-parser')
const cors = require('cors')
const { firestore } = require('firebase-admin')
const app = express()
app.use(cors())
app.use(bodyparser())
const date = new Date()
//console.log(date.getDate())
app.get('/',(req,res)=>res.send('welcome'))
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
   const {clientID,timer} = req.params
   const data = await getTimer(clientID,timer)
   if(data)
    res.send(data)
   else
    res.send(3000)
})

app.get("/setEnv/:clientID/:temp/:hum",async (req,res)=>{
  const {hum,temp,clientID} = req.params
  await setWeather(clientID,hum,temp)
  res.send("done")
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
app.listen(3001,()=>{
  console.log('server started')
})