const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
//const mongoose = require('mongoose')

//config
    //bodyparser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
    //public
    app.use(express.static(path.join(__dirname,'public')))

//grupo de rotas (trazer rotas organizadas em outro lugar para serem reconhecidas aqui)

    app.use('/admin', admin) //(prefixo,referencia a arquivo externo)




 const PORT = 8081
 app.listen(PORT, ()=>{
    console.log('server rodando')
 })