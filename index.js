const express = require("express");
const app = express();
require('dotenv').config()


app.get('/', (req, res)=>{
    return res.json({status: true, message: 'API working'})
})

app.get('/profile', (req, res)=>{
    return res.json({status: true, message: 'Profile route working'})
})

app.get('/youtube', (req, res)=>{
    return res.json({status: true, message: 'Youtube route working'})
})
app.get('/whatsapp', (req, res)=>{
    return res.json({status: true, message: 'Whatsapp route working'})
})

app.listen(process.env.PORT, ()=>{
    console.log('server is listening at post ', process.env.PORT);
})