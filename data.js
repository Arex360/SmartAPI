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
let TodayChallenge = async ()=>{
    const Months = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"]
    const date = new Date();
    const month = date.getMonth();
    const _date = date.getDate();
    const res= await db.collection("Tasks").doc("month").collection(Months[month]).doc(`"${_date}`).get()
    console.log(res)
    return res.data()
}
let WeeklyChallenge = async()=>{
    const Months = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"]
    const date = new Date();
    const month = date.getMonth();
    const _date = date.getDate();
    const _startDate = _date- 7
    if(_startDate <= 0){
        _startDate = 1
    } 
    const res= await db.collection("Tasks").doc("month").collection(Months[month]).where("index",">=",_startDate).where("index","<",_date).limit(7).get()
    let data = []
    res.forEach(doc=>{
        console.log(doc)
        data.push(doc.data())
    })
    return data

}
let Main = async ()=>{
    const data = await TodayChallenge()
    const week = await WeeklyChallenge()
    console.log(data)
    console.log(week)
}
Main()