const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const database = require('./database')
const {request, response} = require("express");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//routes

//create
app.post('/insert', (request,response)=>{
    const {name} = request.body
    const db = database.getDatabaseInstance()

    const result = db.insertNewName(name)

    result
        .then(data => response.json({data:data}))
        .catch(err => console.log(err))

})
//read
app.get('/getAll', (request,response)=>{
    const db = database.getDatabaseInstance()

    const result = db.getAllData()

    result
        .then(data => response.json({data:data}))
        .catch(err => console.log(err))
})

//update
app.patch('/update', (request, response) =>{
    const {id, name} = request.body
    const db = database.getDatabaseInstance()

    const result = db.updateNameById(id, name)

    result
        .then(data => response.json({success:data}))
        .catch(err => console.log(err))
})

//delete
app.delete('/delete/:id',(request, response)=>{
    const {id} = request.params
    const db = database.getDatabaseInstance()

    const result = db.deleteRowById(id)

    result
        .then(data => response.json({success:data}))
        .catch(err => console.log(err))
})



app.listen(process.env.PORT, ()=> console.log('App is running'))