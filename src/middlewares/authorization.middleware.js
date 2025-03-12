// Deprecated, instead use advanced routing strategies!!!

function authorization(role){
    return (req, res, next) => {
        // 401 Unuathorized (No autenticado)
        if(!req.user) return res.status(401).render('unauthenticated.handlebars');
        
        // 403 Forbidden (No autorizado)
        if(req.user.role !== role) return res.status(403).render('unauthorized.handlebars')

        next()
    }
}

module.exports = authorization