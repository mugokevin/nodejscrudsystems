const express = require('express')
const app = express()
const twig = require('twig')
const bodyParser = require('body-parser')

//IMPORT DATABASE CONNECTION
const connection = require('./config/database')
const {request} = require("express");

//SET VIEW ENGINE
app.set('view engine', 'html')
app.engine('html', twig.__express)
app.set('views', 'views')

//USE BODY-PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false}))


//FETCH ALL POSTS FROM DATABASE
app.get('/', (req,res)=>{
    connection.query('SELECT * FROM `people`', (err,results)=>{
        if (err) throw err
        res.render('user',{people:results})
    })
})

//INSERT POST
app.post('/',(req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mobile
    const password = req.body.password
    const people = {
        name: name,
        email:email,
        mobile:mobile,
        password:password,
    }
    connection.query('INSERT INTO `people` SET ?',people, (err)=>{
        if (err) throw err
        console.log('Data inserted')
        return res.redirect('/')
    })
})


//EDIT PAGE
app.get('/update/:id', (req,res)=>{
    const update_postId = req.params.id
    //FIND POST BY ID
    connection.query('SELECT * FROM `people` WHERE id= ?', [update_postId],(err, results)=>{
        if (err) throw err
        res.render('update',{post:results[0]})
    })
})

//UPDATING POST
app.post('/update/:id', (req,res)=>{
    const update_name = req.body.name
    const update_email = req.body.email
    const update_mobile = req.body.mobile
    const update_password = req.body.password
    const userId = req.params.id
    connection.query('UPDATE `people` SET name = ?, email = ?, mobile = ?, password = ? WHERE id = ?', [update_name, update_email, update_mobile,update_password, userId],(err,results)=>{
        if (err) throw err
        if (results.changedRows === 1){
            console.log('Post updated')
            return res.redirect('/')
        }
    })
})


//DELETING POST
app.get('/delete/:id', (req,res) =>{
    connection.query('DELETE FROM `people` WHERE id = ?', [req.params.id], (err,results)=>{
        if (err) throw err
        console.log('Data is deleted')
        return  res.redirect('/')
    })
})

//SET 404 PAGE
// app.use('/',(req, res)={
//     res.status(404).send('<h1>404 Page Not Found!</h1>')
// })


//IF DATABASE CONNECTION IS SUCCESSFUL
connection.connect((err)=>{
    if (err) throw err
    console.log('app is running')
    app.listen(3000)
})




























