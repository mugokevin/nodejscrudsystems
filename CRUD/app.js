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
    connection.query('SELECT * FROM `posts`', (err,results)=>{
        if (err) throw err
        res.render('index',{posts:results})
    })
})

//INSERT POST
app.post('/',(req,res)=>{
    const title = req.body.title
    const content = req.body.content
    const author = req.body.author_name
        const post = {
        title: title,
        content:content,
        author:author,
        created_at:new Date()
    }
    connection.query('INSERT INTO `posts` SET ?',post, (err)=>{
        if (err) throw err
        console.log('Data inserted')
        return res.redirect('/')
    })
})


//EDIT PAGE
app.get('/edit/:id', (req,res)=>{
    const edit_postId = req.params.id
    //FIND POST BY ID
    connection.query('SELECT * FROM `posts` WHERE id= ?', [edit_postId],(err, results)=>{
        if (err) throw err
        res.render('edit',{post:results[0]})
    })
})

//UPDATING POST
app.post('/edit/:id', (req,res)=>{
    const update_title = req.body.title
    const update_content = req.body.content
    const update_author = req.body.author
    const userId = req.params.id
    connection.query('UPDATE `posts` SET title = ?, content = ?, author = ? WHERE id = ?', [update_title, update_content, update_author, userId],(err,results)=>{
        if (err) throw err
        if (results.changedRows === 1){
            console.log('Post updated')
            return res.redirect('/')
        }
    })
})


//DELETING POST
app.get('/delete/:id', (req,res) =>{
    connection.query('DELETE FROM `posts` WHERE id = ?', [req.params.id], (err,results)=>{
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




























