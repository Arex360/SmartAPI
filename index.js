const {getPin,setPin,getTimer,setTimer}= require('./backend')
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
app.get('/getPinState/:clientID/:pinId',async (req,res)=>{
  const {clientID,pinId} = req.params
  const data = await getPin(clientID,pinId)
  if(data != null)
    res.send(data.state)
  else
  res.send("0")
})
app.get('setTimer/:clientID/:timer', async (req,res)=>{
  const {clientID,timer} = req.params
  const data = await setTimer(clientID,timer)
  res.send("updated")
})
app.get('/getTimer/:clientID/',async (req,res)=>{
   const {clientID,timer} = req.params
   const data = await getTimer(clientID,timer)
   if(data)
    res.send(data)
   else
    res.send(3000)
})
app.listen(3000,()=>{
  console.log('server started')
})