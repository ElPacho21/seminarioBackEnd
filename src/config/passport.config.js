const passport = require('passport')

// Strategies
const local = require('passport-local')
const github = require('passport-github2')
const jwt = require('passport-jwt')
const google = require('passport-google-oauth20')

const UserDao = require('../dao/mongoDb/Users.dao')
const { hashPassword, isValidPassword } = require('../utils/bcrypt.util')
const { githubClientID, githubClientSecret } = require('./github.config')
const { backEndUrl } = require('./app.config')
const { privateKey } = require('./jwt.config')
const cookieExtractor = require('../utils/cookieExtractor.util')
const { clientID, clientSecret } = require('./google.config')

const LocalStrategy = local.Strategy
const GithubStrategy = github.Strategy
const JWTStrategy = jwt.Strategy
const GoogleStrategy = google.Strategy

const userDao = new UserDao()

const initializePassport = () => {
    passport.use('register',
        new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                const { firstName, lastName, email, nickName, password } = req.body;
                const user = await userDao.findOne({ email: username })
                if (user) {
                    console.log('Usuario existente')
                    return done(null, false)
                }

                let role = 'client'

                if(email === 'admin@gmail.com' && password === 'admin123') {
                    role = 'admin'
                }

                const newUserInfo = {
                    firstName,
                    lastName,
                    email,
                    role,
                    nickName,
                    password: hashPassword(password)
                }

                const newUser = await userDao.insertOne(newUserInfo)
                done(null, newUser)
            } catch (error) {
                done(error.message)
            }
        })
    )

    passport.use('login', 
        new LocalStrategy({
            usernameField: 'email'
        }, async (username, password, done) => {
            try {
                let user = await userDao.findOne({ email: username }) 
                if(!user){
                    console.log('Usuario no encontrado')
                    return done(null, false, {message: 'Usuario no encontrado'})
                }
                if(!isValidPassword(password, user)){
                    console.log('Contraseña incorrecta')
                    return done(null, false, {message: 'Contraseña incorrecta'})
                }
                done(null, user)
            } catch (error) {
                return done(error)
            }
        })
    )

    /* passport.use('github',
        new GithubStrategy({
            githubClientID,
            githubClientSecret,
            githubCallbackURL: `${backEndUrl}/api/auth/githubCallback`
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile)
                const user = await userDao.findOne({ email: profile._json.email })

                if(!user) {
                    const userInfo = {
                        first_name: profile._json.name,
                        last_name: '',
                        role: 'client',
                        email: profile._json.email,
                        password: ''
                    }
                    const newUser = await userDao.insertOne(userInfo)
                    return done(null, newUser)
                }
                done(null, user)
            } catch (error) {
                done(error.message)
            }
        })
    ) */

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async (jwt_payload, done) => {
        try {
            done(null, jwt_payload)
        } catch (error) {
            console.error(error)
        }

    }))

    passport.use('google', new GoogleStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: `${backEndUrl}/googleCallback`,
        passReqToCallbackURL: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const user = await userDao.findOne({ email: profile._json.email })

            if(!user) {
                const userInfo = {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    role: 'client',
                    email: profile._json.email,
                    password: ''
                }
                const newUser = await userDao.insertOne(userInfo)
                done(null, newUser)
            } else {
                done(null, user)
            }
        } catch (error) {
            done(error.message)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser( async (id, done) => {
        const user = userDao.findById(id)
        done(null, user)
    })
}

module.exports = initializePassport