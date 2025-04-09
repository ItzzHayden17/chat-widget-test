import express, { application } from "express"
import axios from "axios"

const app = express()

app

.listen(2345,()=>{
    console.log("listening on port 2345");
    axios.get("http://localhost:8080").then((res)=>{
        console.log(res.data);
        
    }).catch((err)=>{
        console.log(err);
        
    })
    
})