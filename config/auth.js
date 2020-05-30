const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//model de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email,senha,done)=>{

        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: 'essa conta não existe'})
            }

            bcrypt.compare(senha, usuario.senha, (erro,batem)=>{
                if(batem){
                    return done(null,user)
                }else{
                    return done(null,false, {message: 'senha incorreta'})
                }
            })
        })
    }))
//salvar dados do usuario na sessão
    passport.serialzeUser((usuario,done)=>{
        done(null,usuario.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err, usuario)=>{
            done(err, user)
        })
    })
}

