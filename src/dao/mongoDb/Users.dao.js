const User = require('../models/Users.model')

class UserDao {
    constructor(){}

    async insertOne(user){
        try {
            const {firstName, lastName, role, email, nickName, password} = user

            if (!firstName || !lastName || !role || !email || !nickName || !password) {
                throw new Error('Faltan campos por rellenar');
            }

            const existingUser = await User.findOne({ nickName })
            if(existingUser){
                throw new Error(`El usuario ${nickName} ya existe`)
            }

            const existingEmail = await User.findOne({ email })
            if(existingEmail){
                throw new Error(`El email ${email} ya está siendo utilizado`)
            }
            
            const userInfo = {
                firstName,
                lastName,
                email,
                role,
                nickName,
                password
            }

            const newUser = await User.create(userInfo)

            return newUser
        } catch(error){
            console.error('Error al agregar usuario:', error.message)
            throw new Error('Error al agregar usuario:', error.message)
        }
    }

    async findOne(user){
        try {
            const { email, password } = user

            return await User.findOne({ email })
        } catch(error){
            console.error('Error al buscar usuario:', error.message)
            return null
        }
    }

    async findById(id){
        try {
            return await User.findById(id)
        } catch(error){
            console.error('Error al buscar usuario:', error.message)
            return null
        }
    }

    async updateById(id, updatedUser){
        try {
            return await User.findByIdAndUpdate(id, updatedUser, {new: true} )
        } catch(error){ 
            console.error('Error al actualizar usuario:', error.message)
            return null
        }
    }
}

module.exports = UserDao;