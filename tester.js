const axios = require('axios')
const data = {
        "battery":"300",
        "humidity":"0",
        "temprature": "40",
        "ServoStatus":"1",
        "timer": "15",
        "brightness":"1"
    }
const host = 'http://mnsstrap.ddns.net:3001'
const local = "http://localhost:3001"
//axios.post(host+'/setalldatav2/client1',data).then(data=>console.log(data.data)).catch(e=>console.log(e))

axios.get(host+'/gettimer/client2').then(res=>console.log(res.data))
console.log("0")