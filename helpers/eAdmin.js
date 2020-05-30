module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash('error_msg', 'você deve estar logado como admin para acessar')
        res.redirect('/')
    }
}