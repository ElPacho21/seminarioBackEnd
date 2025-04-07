const { Router } = require('express');
const { verifyToken } = require('../utils/jwt.util');

class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    init(){}

    getRouter() {
        return this.router
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomRoutes, this.applyCallbacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomRoutes, this.applyCallbacks(callbacks))
    }

    patch(path, policies, ...callbacks) {
        this.router.patch(path, this.handlePolicies(policies), this.generateCustomRoutes, this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomRoutes, this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomRoutes, this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
                try {
                    await callback.apply(this, params)
                } catch (error) {
                    console.log(error)
                    // params[1] es el res
                    params[1].status(500).json({ error })
                }
            }
        )
    }

    generateCustomRoutes(req, res, next){
        res.sendSuccess = payload => res.status(200).json({ status: 'success', payload })
        res.sendCreatedSuccess = payload => res.status(201).json({ status: 'success', payload })
        res.sendServerError = error => res.status(500).json({ status: 'error', error })
        res.sendUserError = error => res.status(400).json({ status: 'error', error })

        next()
    }

    handlePolicies(policies){
        return (req, res, next) => {
            if(policies.includes('PUBLIC')) return next()
            
            const token = req.cookies.authToken; 

            if(!token) return res.status(401).json({ error: 'Not authorized' })
            
            const user = verifyToken(token)

            /* if(!policies.includes(user.role.toUpperCase())) return res.status(403).json({ error: 'Not authorized' }) */
            if(!policies.includes(user.role.toUpperCase())) return res.status(403).json({error: 'Not authenticated'})
            
            req.user = user
            next()
        }
    }
}

module.exports = CustomRouter;