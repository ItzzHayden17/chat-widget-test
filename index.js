import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
const port = 8080

// const corsOptions = {
//     origin: function (origin,callback){
//         const allowedOrigin = /^(https?:\/\/)?([\w-]+\.)*amplifin\.co\.za$/

//         if(allowedOrigin.test(origin) || !origin){
//             callback(null,true)
//         }else{
//             callback(new Error("Not allowed by CORS"),false)
//             console.log(origin);
            
//         }
//     }
// }

// app.use(cors(corsOptions))
app.use(cors())

// morne = 19092221395740 colleen = 12666713103132 zandile = 13602073995804 jessica = 19092221395740 jo = 12666711504924 anray = 19188101330460

const agent_id = 19188101330460
app
.get("/",async (req,res)=>{
    await axios.get(`https://amplifin.zendesk.com/api/v2/agent_availabilities/${agent_id}`,{
        headers:{
            "Content-Type": "application/json",
            Authorization : "Basic " + btoa("dduplessis@amplifin.co.za/token:4fOCcxGK9mLXPblJrWdkS0uWhmZfCZxoJyIufgL5"),
            Accept: "application/json",
        }
    }).then((response)=>{
        const agent_availibilities =  response.data.included
        for (let i = 0; i < agent_availibilities.length; i++) {
            if (agent_availibilities[i].id == `agent_availabilities|${agent_id}|channels|chat`) {
                console.log(agent_availibilities[i].attributes.status);
                if (agent_availibilities[i].attributes.status == 'online') {    
                    res.send(200)
                }else{
                    res.send(400)
                }
            }
            
        }

    })

})

.listen(port ,()=>{
    console.log(`Listening on port ${port}`);
})
