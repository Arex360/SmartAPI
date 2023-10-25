const axios = require('axios')
const data = 
    {
        "battery":"300",
        "humidity":"0",
        "temprature": "40",
        "ServoStatus":"1"
    }
axios.post('http://mnsstrap.ddns.net:3001/setalldata/client1',data).then(data=>console.log(data.data))