const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagens')
const Postagem = mongoose.model("postagens")

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
        req.flash("success_msg",'categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','houve um erro ao deletar')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', (req,res)=>{
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao listas as postagens')
        res.redirect('/admin')
    })
   
})

router.get('/postagens/add', (req,res)=>{
    Categoria.find().lean().then((categorias) =>{
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao carregar cate')
        res.redirect('/admin')
    })
})
router.post('/postagens/new', (req,res)=>{
    var error = []
    if(req.body.categoria == 0){
        error.push({text: 'categoria invalida'} )
    }
    if(error.length>0){
        res.render('admin/addpostagens' ,{error: error})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'postagem criada com sucesso')
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash('error_msg', 'houve um error durante o salvamento' +err)
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id',(req,res)=>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{

        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editpostagens',{categorias: categorias, postagem: postagem})

            }).catch((err)=>{
                req.flash('error_msg', 'houve um erro ao carregar categorias p o form ' +err) 
                res.redirect('/admin/postagens')
            })
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao carregar o form de edição' + err)
        res.redirect('/admin/postagens')
    })
    
})
router.post("/postagem/edit", (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo,
        postagem.descricao = req.body.descricao,
        postagem.slug = req.body.slug,
        postagem.categoria = req.body.categoria,
        postagem.conteudo = req.body.conteudo

        postagem.save().then(()=>{
            req.flash('success_msg','edição salva com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            console.log(err)
            req.flash('error_msg','ocorreu um erro ao salvar as alterações'+err)
            res.redirect('/admin/postagens')
        })

    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg','houve um erro ao salvar a edição' +err)
        res.redirect('/admin/postagens')
    })
})

router.get("/postagens/delete/:id", (req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg",'postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','houve um erro')
        res.redirect('admin/postagens')

    })
})
module.exports = router