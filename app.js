const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model('postagens')
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

    app.get('/', (req,res)=>{
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens})   
        }).catch((err)=>{
            req.flash('error_msg','houve um erro interno')
            res.redirect('/404')
        })
        
    })
    app.get('/404', (req,res)=>{
        res.send('error404')
    })
    
    app.get('/postagem/:slug', (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash('error_msg','esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg','houve um erro interno')
            res.redirect('/')
        })
    })


    app.get('/posts',(req,res)=>{

    })

 const PORT = 8081
 app.listen(PORT, ()=>{
    console.log('server rodando')
 })