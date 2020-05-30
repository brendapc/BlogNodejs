const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//config
    //session
    app.use(session({
        secret: 'testenode',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    
    //middlewear
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    //bodyparser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log('conectado ao mongo')
    }).catch((err)=>{
        console.log('erro ao conectar com o mongo'+err)
    })
    //public
    app.use(express.static(path.join(__dirname,'public')))
    
    
//grupo de rotas (trazer rotas organizadas em outro lugar para serem reconhecidas aqui)

    app.use('/admin', admin) //(prefixo,referencia a arquivo externo)




 const PORT = 8081
 app.listen(PORT, ()=>{
    console.log('server rodando')
 })