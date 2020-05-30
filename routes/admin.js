const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req,res)=>{
    res.render('admin/index')
})

router.get('/posts', (req,res)=>{
    res.send('pagina de posts')
})
router.get('/categorias', (req,res)=>{
    Categoria.find().lean().sort({date: 'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg','houve um erro')
        res.redirect('/admin')
    })   
})

router.get('/categorias/add', (req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req,res)=>{
    var erros = []

    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({text: 'nome inválido'})
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        erros.push({text: 'slug inválido'})
    }
    if(erros.length>0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg','categoria registrada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'houve um erro ao registrar categorias')
            res.redirect('/admin/categorias')
        })
    }
})

router.get("/categorias/edit/:id",(req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) =>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'essa categoria nao existe')
        res.redirect("/admin/categorias")
    })
})
router.post("/categorias/edit", (req,res)=>{
    
   
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", 'categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) =>{
            req.flash('error_msg', 'preenchimento invalido')
            res.redirect('/admin/categorias')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})
router.post('/categorias/deletar', (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg",'categoria deletada com sucessp')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','houve um erro ao deletar')
        res.redirect('/admin/categorias')
    })
})

module.exports = router