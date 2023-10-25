const axios = require('axios')
const data = 
    {
        "battery":"300",
        "humidity":"0",
        "temprature": "40",
        "ServoStatus":"1",
        "timer": "15"
    }
const host = 'http://mnsstrap.ddns.net:3001'
const local = "http://localhost:3001"
axios.post(local+'/setalldata/client1',data).then(data=>console.log(data.data)).catch(e=>console.log(e))

axios.get(local+'/getalldata/client1').then(res=>console.log(res.data))